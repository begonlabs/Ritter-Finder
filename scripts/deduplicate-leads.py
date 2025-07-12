#!/usr/bin/env python3
"""
Lead Deduplication Script for RitterFinder
Detects and removes duplicate leads from CSV files using intelligent matching
"""

import csv
import re
import argparse
from pathlib import Path
from typing import Dict, List, Tuple, Set
from difflib import SequenceMatcher
import hashlib

class LeadDeduplicator:
    def __init__(self, input_file: str, output_file: str = None, report_file: str = None):
        self.input_file = Path(input_file)
        self.output_file = Path(output_file) if output_file else self.input_file.with_suffix('.deduplicated.csv')
        self.report_file = Path(report_file) if report_file else self.input_file.with_suffix('.duplicates_report.txt')
        
        # Similarity thresholds
        self.name_similarity_threshold = 0.85
        self.address_similarity_threshold = 0.80
        self.phone_exact_match = True
        self.website_similarity_threshold = 0.90
        
        self.leads = []
        self.duplicates_found = []
        self.stats = {
            'total_leads': 0,
            'unique_leads': 0,
            'duplicates_removed': 0,
            'name_duplicates': 0,
            'phone_duplicates': 0,
            'website_duplicates': 0,
            'address_duplicates': 0
        }
    
    def normalize_text(self, text: str) -> str:
        """Normalize text for comparison"""
        if not text:
            return ""
        
        # Convert to lowercase
        text = text.lower().strip()
        
        # Remove common business suffixes
        suffixes = [
            r'\s+(sl|sa|slu|sll|s\.l\.|s\.a\.|s\.l\.u\.|s\.l\.l\.)', 
            r'\s+(ltd|ltd\.|limited|inc|inc\.|corp|corp\.)',
            r'\s+(sociedad limitada|sociedad anonima)',
            r'\s+(empresa|company|compañia|cia|cia\.)'
        ]
        
        for suffix in suffixes:
            text = re.sub(suffix, '', text)
        
        # Remove extra spaces and special characters
        text = re.sub(r'[^\w\s]', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def normalize_phone(self, phone: str) -> str:
        """Normalize phone number for comparison"""
        if not phone:
            return ""
        
        # Remove all non-digits
        digits = re.sub(r'[^\d]', '', phone)
        
        # Remove country code if present
        if digits.startswith('34') and len(digits) == 11:
            digits = digits[2:]
        
        return digits
    
    def normalize_website(self, website: str) -> str:
        """Normalize website URL for comparison"""
        if not website:
            return ""
        
        # Remove protocol and www
        website = re.sub(r'^https?://(www\.)?', '', website.lower())
        
        # Remove trailing slash and query parameters
        website = re.sub(r'[/?].*$', '', website)
        
        return website
    
    def similarity(self, text1: str, text2: str) -> float:
        """Calculate similarity between two texts"""
        if not text1 and not text2:
            return 1.0
        if not text1 or not text2:
            return 0.0
        
        return SequenceMatcher(None, text1, text2).ratio()
    
    def generate_fingerprint(self, lead: Dict[str, str]) -> str:
        """Generate a unique fingerprint for exact matching"""
        # Use normalized phone or website as primary identifier
        phone = self.normalize_phone(lead.get('phone', ''))
        website = self.normalize_website(lead.get('company_website', ''))
        
        if phone:
            return f"phone:{phone}"
        elif website:
            return f"website:{website}"
        else:
            # Use name + address hash for businesses without phone/website
            name = self.normalize_text(lead.get('company_name', ''))
            address = self.normalize_text(lead.get('address', ''))
            combined = f"{name}:{address}"
            return f"hash:{hashlib.md5(combined.encode()).hexdigest()[:8]}"
    
    def is_duplicate(self, lead1: Dict[str, str], lead2: Dict[str, str]) -> Tuple[bool, str]:
        """Check if two leads are duplicates and return reason"""
        
        # Exact phone match (strongest indicator)
        phone1 = self.normalize_phone(lead1.get('phone', ''))
        phone2 = self.normalize_phone(lead2.get('phone', ''))
        
        if phone1 and phone2 and phone1 == phone2:
            return True, f"identical_phone: {phone1}"
        
        # Exact website match (strong indicator)
        website1 = self.normalize_website(lead1.get('company_website', ''))
        website2 = self.normalize_website(lead2.get('company_website', ''))
        
        if website1 and website2 and website1 == website2:
            return True, f"identical_website: {website1}"
        
        # Company name similarity
        name1 = self.normalize_text(lead1.get('company_name', ''))
        name2 = self.normalize_text(lead2.get('company_name', ''))
        
        if name1 and name2:
            name_sim = self.similarity(name1, name2)
            
            if name_sim >= self.name_similarity_threshold:
                # If names are very similar, check address too
                addr1 = self.normalize_text(lead1.get('address', ''))
                addr2 = self.normalize_text(lead2.get('address', ''))
                
                if addr1 and addr2:
                    addr_sim = self.similarity(addr1, addr2)
                    
                    if addr_sim >= self.address_similarity_threshold:
                        return True, f"similar_name_address: {name_sim:.2f}/{addr_sim:.2f}"
                
                # Very high name similarity alone
                if name_sim >= 0.95:
                    return True, f"very_similar_name: {name_sim:.2f}"
        
        return False, ""
    
    def select_best_lead(self, duplicates: List[Dict[str, str]]) -> Dict[str, str]:
        """Select the best lead from a group of duplicates"""
        if len(duplicates) == 1:
            return duplicates[0]
        
        # Score each lead
        scored_leads = []
        
        for lead in duplicates:
            score = 0
            
            # Base score from data_quality_score
            try:
                score += int(lead.get('data_quality_score', 1)) * 10
            except:
                score += 10
            
            # Bonus for having phone
            if lead.get('phone'):
                score += 15
            
            # Bonus for having website
            if lead.get('company_website'):
                score += 10
            
            # Bonus for having description
            if lead.get('description') and lead.get('description') != 'N/A':
                score += 5
            
            # Bonus for having address
            if lead.get('address'):
                score += 5
            
            # Penalty for missing key fields
            if not lead.get('company_name'):
                score -= 20
            
            scored_leads.append((score, lead))
        
        # Sort by score (highest first)
        scored_leads.sort(key=lambda x: x[0], reverse=True)
        
        return scored_leads[0][1]
    
    def load_leads(self) -> None:
        """Load leads from CSV file"""
        print(f"📖 Loading leads from {self.input_file}...")
        
        with open(self.input_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            self.leads = list(reader)
        
        self.stats['total_leads'] = len(self.leads)
        print(f"✅ Loaded {self.stats['total_leads']} leads")
    
    def find_duplicates(self) -> None:
        """Find all duplicate groups"""
        print("🔍 Searching for duplicates...")
        
        # Group leads by fingerprint for exact matches
        fingerprint_groups = {}
        similarity_candidates = []
        
        for i, lead in enumerate(self.leads):
            fingerprint = self.generate_fingerprint(lead)
            
            if fingerprint.startswith('hash:'):
                # These need similarity checking
                similarity_candidates.append((i, lead))
            else:
                # These can be grouped by exact fingerprint
                if fingerprint not in fingerprint_groups:
                    fingerprint_groups[fingerprint] = []
                fingerprint_groups[fingerprint].append((i, lead))
        
        # Process exact fingerprint groups
        duplicate_groups = []
        
        for fingerprint, group in fingerprint_groups.items():
            if len(group) > 1:
                duplicate_groups.append([item[1] for item in group])
                if fingerprint.startswith('phone:'):
                    self.stats['phone_duplicates'] += len(group) - 1
                elif fingerprint.startswith('website:'):
                    self.stats['website_duplicates'] += len(group) - 1
        
        # Process similarity candidates
        processed = set()
        
        for i, (idx1, lead1) in enumerate(similarity_candidates):
            if idx1 in processed:
                continue
            
            current_group = [lead1]
            processed.add(idx1)
            
            for j, (idx2, lead2) in enumerate(similarity_candidates[i+1:], i+1):
                if idx2 in processed:
                    continue
                
                is_dup, reason = self.is_duplicate(lead1, lead2)
                if is_dup:
                    current_group.append(lead2)
                    processed.add(idx2)
                    
                    if 'name' in reason:
                        self.stats['name_duplicates'] += 1
                    elif 'address' in reason:
                        self.stats['address_duplicates'] += 1
            
            if len(current_group) > 1:
                duplicate_groups.append(current_group)
        
        # Store duplicate information
        for group in duplicate_groups:
            best_lead = self.select_best_lead(group)
            
            duplicate_info = {
                'group': group,
                'best_lead': best_lead,
                'removed_count': len(group) - 1,
                'reasons': []
            }
            
            # Analyze reasons for this group
            for lead in group:
                if lead != best_lead:
                    is_dup, reason = self.is_duplicate(best_lead, lead)
                    duplicate_info['reasons'].append(reason)
            
            self.duplicates_found.append(duplicate_info)
        
        total_duplicates = sum(dup['removed_count'] for dup in self.duplicates_found)
        self.stats['duplicates_removed'] = total_duplicates
        self.stats['unique_leads'] = self.stats['total_leads'] - total_duplicates
        
        print(f"🔍 Found {len(self.duplicates_found)} duplicate groups")
        print(f"📊 Total duplicates to remove: {total_duplicates}")
    
    def generate_clean_csv(self) -> None:
        """Generate clean CSV with duplicates removed"""
        print(f"🧹 Generating clean CSV: {self.output_file}")
        
        # Collect all best leads
        kept_leads = set()
        clean_leads = []
        
        # Add best leads from duplicate groups
        for dup_info in self.duplicates_found:
            best_lead = dup_info['best_lead']
            lead_key = id(best_lead)  # Use object id as unique identifier
            
            if lead_key not in kept_leads:
                clean_leads.append(best_lead)
                kept_leads.add(lead_key)
        
        # Add unique leads (not in any duplicate group)
        all_duplicate_leads = set()
        for dup_info in self.duplicates_found:
            for lead in dup_info['group']:
                all_duplicate_leads.add(id(lead))
        
        for lead in self.leads:
            if id(lead) not in all_duplicate_leads:
                clean_leads.append(lead)
        
        # Write clean CSV
        if clean_leads:
            with open(self.output_file, 'w', newline='', encoding='utf-8') as f:
                fieldnames = clean_leads[0].keys()
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(clean_leads)
        
        print(f"✅ Clean CSV created with {len(clean_leads)} unique leads")
    
    def generate_report(self) -> None:
        """Generate detailed duplicate report"""
        print(f"📄 Generating duplicate report: {self.report_file}")
        
        with open(self.report_file, 'w', encoding='utf-8') as f:
            f.write("🔍 RITTERFINDER DUPLICATE LEADS REPORT\n")
            f.write("=" * 50 + "\n\n")
            
            # Summary statistics
            f.write("📊 SUMMARY\n")
            f.write("-" * 20 + "\n")
            f.write(f"Total leads processed: {self.stats['total_leads']}\n")
            f.write(f"Unique leads kept: {self.stats['unique_leads']}\n")
            f.write(f"Duplicates removed: {self.stats['duplicates_removed']}\n")
            f.write(f"Duplicate groups found: {len(self.duplicates_found)}\n\n")
            
            f.write("🏷️ DUPLICATE TYPES\n")
            f.write("-" * 20 + "\n")
            f.write(f"Phone duplicates: {self.stats['phone_duplicates']}\n")
            f.write(f"Website duplicates: {self.stats['website_duplicates']}\n")
            f.write(f"Name duplicates: {self.stats['name_duplicates']}\n")
            f.write(f"Address duplicates: {self.stats['address_duplicates']}\n\n")
            
            # Detailed duplicate groups
            f.write("📋 DETAILED DUPLICATE GROUPS\n")
            f.write("-" * 30 + "\n\n")
            
            for i, dup_info in enumerate(self.duplicates_found, 1):
                f.write(f"GROUP {i} ({dup_info['removed_count']} duplicates removed)\n")
                f.write("=" * 40 + "\n")
                
                best_lead = dup_info['best_lead']
                f.write(f"✅ KEPT: {best_lead.get('company_name', 'N/A')}\n")
                f.write(f"   Phone: {best_lead.get('phone', 'N/A')}\n")
                f.write(f"   Website: {best_lead.get('company_website', 'N/A')}\n")
                f.write(f"   Address: {best_lead.get('address', 'N/A')}\n")
                f.write(f"   Quality Score: {best_lead.get('data_quality_score', 'N/A')}\n\n")
                
                f.write("❌ REMOVED:\n")
                for j, lead in enumerate(dup_info['group']):
                    if lead != best_lead:
                        reason = dup_info['reasons'][j-1] if j-1 < len(dup_info['reasons']) else "unknown"
                        f.write(f"   • {lead.get('company_name', 'N/A')} (Reason: {reason})\n")
                        f.write(f"     Phone: {lead.get('phone', 'N/A')}\n")
                        f.write(f"     Website: {lead.get('company_website', 'N/A')}\n")
                        f.write(f"     Quality Score: {lead.get('data_quality_score', 'N/A')}\n")
                
                f.write("\n" + "-" * 40 + "\n\n")
        
        print(f"✅ Report generated successfully")
    
    def deduplicate(self) -> None:
        """Main deduplication process"""
        print("🚀 Starting lead deduplication process...")
        
        self.load_leads()
        self.find_duplicates()
        self.generate_clean_csv()
        self.generate_report()
        
        print(f"\n🎉 Deduplication completed!")
        print(f"📈 Original leads: {self.stats['total_leads']}")
        print(f"📉 Duplicates removed: {self.stats['duplicates_removed']}")
        print(f"✨ Clean leads: {self.stats['unique_leads']}")
        print(f"📁 Clean file: {self.output_file}")
        print(f"📄 Report file: {self.report_file}")

def main():
    parser = argparse.ArgumentParser(description='Deduplicate leads from CSV file')
    parser.add_argument('input_file', help='Input CSV file with leads')
    parser.add_argument('--output', '-o', help='Output CSV file (default: input_file.deduplicated.csv)')
    parser.add_argument('--report', '-r', help='Report file (default: input_file.duplicates_report.txt)')
    parser.add_argument('--name-threshold', type=float, default=0.85, help='Name similarity threshold (0.0-1.0)')
    parser.add_argument('--address-threshold', type=float, default=0.80, help='Address similarity threshold (0.0-1.0)')
    
    args = parser.parse_args()
    
    deduplicator = LeadDeduplicator(args.input_file, args.output, args.report)
    deduplicator.name_similarity_threshold = args.name_threshold
    deduplicator.address_similarity_threshold = args.address_threshold
    
    deduplicator.deduplicate()

if __name__ == '__main__':
    main() 