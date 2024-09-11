import { ThemeProvider } from "next-themes";
import "../css/tailwind.css";
import { AuthProvider } from '../contexts/AuthContext'; // Importa el AuthProvider

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider> {/* Envolvemos la aplicación con el AuthProvider */}
      <ThemeProvider attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;
