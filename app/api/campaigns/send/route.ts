import { NextRequest, NextResponse } from 'next/server';
import { brevoService } from '../../../../lib/brevo-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type === 'email') {
      // Enviar email individual
      const result = await brevoService.sendEmail(data);
      return NextResponse.json(result);
    } else if (type === 'campaign') {
      // Enviar campaña
      const result = await brevoService.sendCampaign(data);
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, error: 'Tipo de envío no válido' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error en API de campañas:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 