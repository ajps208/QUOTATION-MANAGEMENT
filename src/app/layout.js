import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'Quotely — Quotation Management Platform',
  description: 'A modern quotation management system for businesses and customers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
