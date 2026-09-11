import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  if (process.env.ENABLE_BASIC_AUTH !== 'true') {
    return NextResponse.next();
  }

  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    try {
      const authValue = basicAuth.split(' ')[1];
      const decoded = atob(authValue);
      const [user, pwd] = decoded.split(':');

      const expectedUser = process.env.BASIC_AUTH_USER || 'admin';
      const expectedPassword = process.env.BASIC_AUTH_PASSWORD || 'password';

      if (user === expectedUser && pwd === expectedPassword) {
        return NextResponse.next();
      }
    } catch {
      // Ignorar error de decodificación y solicitar autenticación
    }
  }

  return new NextResponse('Acceso restringido: Autenticacion requerida', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Judith HairStudio"',
    },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|uploads/).*)'],
};
