#!/usr/bin/env python3
"""
JSON to CSV Converter for RitterFinder Leads
Converts JSON files from Axesor and Páginas Amarillas to CSV format
matching the leads table structure.
"""

import json
import csv
import os
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional
import argparse

class LeadConverter:
    def __init__(self, input_dir: str, output_dir: str):
        self.input_dir = Path(input_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # CSV headers matching leads table structure
        self.csv_headers = [
            'company_name',
            'email',
            'verified_email',
            'phone',
            'verified_phone', 
            'company_website',
            'verified_website',
            'address',
            'state',
            'country',
            'activity',
            'description',
            'category',
            'data_quality_score',
            'created_at'
        ]
        
    def identify_format(self, data: Dict[str, Any]) -> str:
        """Identify if data is from Axesor or Páginas Amarillas format"""
        if 'cif' in data and 'cnae' in data:
            return 'axesor'
        elif 'actividades' in data and 'telefono' in data:
            return 'paginas_amarillas'
        else:
            return 'unknown'
    
    def clean_phone(self, phone: str) -> Optional[str]:
        """Clean and format phone number"""
        if not phone or phone.upper() == 'N/A':
            return None
        
        # Remove common prefixes and clean
        phone = re.sub(r'^\+34', '', phone.strip())
        phone = re.sub(r'[^\d]', '', phone)
        
        # Spanish phone validation (9 digits)
        if len(phone) == 9 and phone[0] in '6789':
            return f"+34{phone}"
        
        return phone if phone else None
    
    def clean_website(self, website: str) -> Optional[str]:
        """Clean and validate website URL"""
        if not website or website.upper() == 'N/A':
            return None
            
        website = website.strip()
        if not website.startswith(('http://', 'https://')):
            website = f"https://{website}"
            
        # Remove UTM parameters
        website = re.sub(r'\?utm_.*$', '', website)
        
        return website
    
    def extract_location_info(self, address: str) -> tuple:
        """Extract state and country from address"""
        if not address:
            return None, 'España'
        
        # Common Spanish provinces/regions
        provinces = [
            'MADRID', 'BARCELONA', 'VALENCIA', 'SEVILLA', 'BILBAO', 
            'ZARAGOZA', 'ALICANTE', 'MÁLAGA', 'MURCIA', 'CÓRDOBA',
            'VALLADOLID', 'VIGO', 'GIJÓN', 'HOSPITALET', 'VITORIA',
            'LA CORUÑA', 'GRANADA', 'ELCHE', 'OVIEDO', 'BADALONA'
        ]
        
        address_upper = address.upper()
        for province in provinces:
            if province in address_upper:
                return province.title(), 'España'
        
        # Try to extract from postal code pattern
        postal_match = re.search(r'(\d{5})', address)
        if postal_match:
            postal_code = postal_match.group(1)
            # Madrid postal codes start with 28
            if postal_code.startswith('28'):
                return 'Madrid', 'España'
        
        return None, 'España'
    
    def calculate_quality_score(self, lead: Dict[str, Any]) -> int:
        """Calculate data quality score (1-5)"""
        score = 1  # Base score
        
        if lead.get('phone'):
            score += 1
        if lead.get('company_website'):
            score += 1
        if lead.get('email'):
            score += 1
        if lead.get('description'):
            score += 1
            
        return min(score, 5)
    
    def convert_axesor_lead(self, data: Dict[str, Any], category: str) -> Dict[str, Any]:
        """Convert Axesor format to lead format"""
        # Extract company name (remove business type suffixes)
        company_name = data.get('nombre', '').strip()
        
        # Clean address
        address = data.get('direccion', '')
        if 'Ver mapa si la empresa tiene delegaciones' in address:
            address = address.replace('Ver mapa si la empresa tiene delegaciones', '').strip()
        
        state, country = self.extract_location_info(address)
        
        lead = {
            'company_name': company_name,
            'email': None,  # Axesor doesn't provide emails
            'verified_email': False,
            'phone': None,  # Axesor doesn't provide phones
            'verified_phone': False,
            'company_website': None,  # Axesor doesn't provide websites
            'verified_website': False,
            'address': address,
            'state': state,
            'country': country,
            'activity': data.get('cnae', '').strip(),
            'description': data.get('objeto_social', '').strip(),
            'category': category,
            'data_quality_score': 1,  # Base score for Axesor
            'created_at': datetime.now().isoformat()
        }
        
        lead['data_quality_score'] = self.calculate_quality_score(lead)
        return lead
    
    def convert_paginas_amarillas_lead(self, data: Dict[str, Any], category: str) -> Dict[str, Any]:
        """Convert Páginas Amarillas format to lead format"""
        # Extract company name (remove location part)
        nombre_completo = data.get('nombre', '')
        if '\n' in nombre_completo:
            company_name = nombre_completo.split('\n')[0].strip()
        else:
            company_name = nombre_completo.strip()
        
        # Clean phone
        phone = self.clean_phone(data.get('telefono', ''))
        
        # Clean website
        website = self.clean_website(data.get('website', ''))
        
        # Clean address
        address = data.get('direccion', '').strip()
        if address.upper() == 'N/A':
            address = None
            
        state, country = self.extract_location_info(address)
        
        lead = {
            'company_name': company_name,
            'email': None,  # PA doesn't provide emails
            'verified_email': False,
            'phone': phone,
            'verified_phone': bool(phone),
            'company_website': website,
            'verified_website': bool(website),
            'address': address,
            'state': state,
            'country': country,
            'activity': data.get('actividades', '').strip(),
            'description': data.get('descripcion', '').strip(),
            'category': category,
            'data_quality_score': 1,
            'created_at': datetime.now().isoformat()
        }
        
        lead['data_quality_score'] = self.calculate_quality_score(lead)
        return lead
    
    def extract_category_from_filename(self, filename: str) -> str:
        """Extract category from filename"""
        # Remove extension and timestamp
        name_parts = filename.replace('.json', '').split('_')
        
        if filename.startswith('axesor'):
            return 'Empresas Axesor'
        elif filename.startswith('pa_'):
            # Extract category from PA filename
            category_code = name_parts[1] if len(name_parts) > 1 else 'general'
            
            # Map category codes to readable names
            category_map = {
                'abogados': 'Abogados',
                'bares': 'Bares y Restauración',
                'belleza': 'Centros de Belleza y Estética',
                'cafeterias': 'Cafeterías',
                'comidaChina': 'Restaurantes Asiáticos',
                'copas': 'Pubs y Coctelerías',
                'dentistas': 'Clínicas Dentales',
                'desguaces': 'Desguaces y Automoción',
                'estancos': 'Estancos',
                'farmacias': 'Farmacias',
                'farmacias24h': 'Farmacias 24 Horas',
                'floristerias': 'Floristerías y Jardinería',
                'fontaneros24h': 'Fontaneros y Multiservicios',
                'gasolineras': 'Estaciones de Servicio',
                'gestorias': 'Gestorías y Asesorías',
                'gimnasios': 'Gimnasios y Deporte',
                'guarderias': 'Guarderías y Educación Infantil',
                'hoteles': 'Hoteles y Alojamiento',
                'loteria': 'Administraciones de Lotería',
                'parking': 'Aparcamientos y Garajes',
                'peluquerias': 'Peluquerías',
                'pizzerias': 'Pizzerías',
                'pollosAsados': 'Pollos Asados y Comida Preparada',
                'restaurantes': 'Restaurantes',
                'salud': 'Centros Médicos y Salud',
                'supermercados': 'Supermercados e Hipermercados',
                'talleres': 'Talleres Mecánicos',
                'talleres24h': 'Talleres Mecánicos 24H',
                'taxis': 'Taxis y Transporte',
                'tiendas_ropa': 'Tiendas de Ropa',
                'urgenciaMedica24h': 'Urgencias Médicas 24H',
                'veterinarios': 'Veterinarios',
                'veterinarios24h': 'Veterinarios 24H'
            }
            
            return category_map.get(category_code, category_code.title())
        
        return 'General'
    
    def process_json_file(self, file_path: Path) -> List[Dict[str, Any]]:
        """Process a single JSON file and return list of leads"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Handle both single objects and arrays
            if isinstance(data, dict):
                data = [data]
            elif not isinstance(data, list):
                print(f"⚠️  Warning: Unexpected data format in {file_path}")
                return []
            
            leads = []
            category = self.extract_category_from_filename(file_path.name)
            
            for item in data:
                if not isinstance(item, dict):
                    continue
                    
                format_type = self.identify_format(item)
                
                if format_type == 'axesor':
                    lead = self.convert_axesor_lead(item, category)
                elif format_type == 'paginas_amarillas':
                    lead = self.convert_paginas_amarillas_lead(item, category)
                else:
                    print(f"⚠️  Unknown format in {file_path}: {item}")
                    continue
                
                # Skip if no company name
                if not lead.get('company_name'):
                    continue
                    
                leads.append(lead)
            
            return leads
            
        except Exception as e:
            print(f"❌ Error processing {file_path}: {str(e)}")
            return []
    
    def write_csv(self, leads: List[Dict[str, Any]], output_file: Path):
        """Write leads to CSV file"""
        if not leads:
            print(f"⚠️  No leads to write for {output_file}")
            return
            
        try:
            with open(output_file, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=self.csv_headers)
                writer.writeheader()
                
                for lead in leads:
                    # Ensure all headers are present
                    row = {header: lead.get(header, '') for header in self.csv_headers}
                    writer.writerow(row)
                    
            print(f"✅ Created {output_file} with {len(leads)} leads")
            
        except Exception as e:
            print(f"❌ Error writing {output_file}: {str(e)}")
    
    def convert_all(self):
        """Convert all JSON files to CSV"""
        print("🚀 Starting JSON to CSV conversion...")
        
        # Find all JSON files
        json_files = list(self.input_dir.glob('*.json'))
        
        if not json_files:
            print(f"❌ No JSON files found in {self.input_dir}")
            return
        
        print(f"📁 Found {len(json_files)} JSON files")
        
        # Group leads by category
        leads_by_category = {}
        
        for json_file in json_files:
            print(f"📄 Processing {json_file.name}...")
            
            leads = self.process_json_file(json_file)
            
            if not leads:
                continue
                
            # Group by category
            for lead in leads:
                category = lead['category']
                if category not in leads_by_category:
                    leads_by_category[category] = []
                leads_by_category[category].append(lead)
        
        # Write CSV files by category
        print(f"\n📊 Creating CSV files for {len(leads_by_category)} categories...")
        
        for category, leads in leads_by_category.items():
            # Create safe filename
            safe_category = re.sub(r'[^\w\s-]', '', category)
            safe_category = re.sub(r'[-\s]+', '_', safe_category)
            
            output_file = self.output_dir / f"leads_{safe_category.lower()}.csv"
            self.write_csv(leads, output_file)
        
        # Create combined CSV
        all_leads = []
        for leads in leads_by_category.values():
            all_leads.extend(leads)
        
        if all_leads:
            combined_file = self.output_dir / "leads_combined.csv"
            self.write_csv(all_leads, combined_file)
            
        print(f"\n🎉 Conversion completed!")
        print(f"📈 Total leads processed: {len(all_leads)}")
        print(f"📂 Output directory: {self.output_dir}")

def main():
    parser = argparse.ArgumentParser(description='Convert JSON leads to CSV format')
    parser.add_argument('--input', '-i', default='models/fvOdGZZZ', help='Input directory with JSON files')
    parser.add_argument('--output', '-o', default='output/csv', help='Output directory for CSV files')
    
    args = parser.parse_args()
    
    converter = LeadConverter(args.input, args.output)
    converter.convert_all()

if __name__ == '__main__':
    main() 