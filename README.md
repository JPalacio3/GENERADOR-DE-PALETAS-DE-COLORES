# 🎨 Generador de Paletas de Colores Avanzado

¡Bienvenido al Generador de Paletas de Colores! Una aplicación web moderna y completa construida con React, Vite y TypeScript, diseñada para ofrecer a diseñadores, desarrolladores y creativos un conjunto de herramientas potentes para trabajar con colores de manera eficiente y accesible.

Esta aplicación no solo te permite generar paletas de colores aleatorias, sino que también incluye funcionalidades avanzadas como extracción de colores desde imágenes, generación de armonías, simuladores de visión de color y mucho más.

**[➡️ Ver App](https://generador-de-paleta-de-colores.netlify.app/)**

---

## ✨ Características Principales

Este proyecto va más allá de un simple generador y ofrece un completo set de herramientas para el manejo del color:

- **🎨 Generador de Paletas**: Crea paletas de colores personalizables. Puedes ajustar el número de colores y bloquear tus favoritos para mantenerlos mientras exploras nuevas combinaciones.
- **🖼️ Extractor de Colores de Imágenes**: Sube una imagen y la aplicación extraerá automáticamente su paleta de colores dominante.
- **🤝 Generador de Armonías de Color**: A partir de un color base, genera esquemas de color armoniosos (complementarios, triádicos, análogos, etc.).
- **🧪 Mezclador de Colores (Blender)**: Combina dos colores para encontrar los tonos intermedios perfectos.
- **♿ Comprobador de Contraste**: Asegura la accesibilidad de tus diseños verificando el ratio de contraste entre dos colores, cumpliendo con las directrices WCAG.
- **👁️ Simulador de Daltonismo**: Visualiza tus paletas como las verían personas con diferentes tipos de daltonismo (protanopia, deuteranopia, tritanopia).
- **🐾 Simulador de Visión Animal**: Una herramienta divertida y educativa para ver cómo perciben los colores diferentes animales.
- **🌓 Tema Claro y Oscuro**: Interfaz cómoda para trabajar en cualquier condición de iluminación.
- **💻 Diseño Responsivo**: Experiencia de usuario fluida tanto en dispositivos de escritorio como móviles.
- **💾 Exportación a JSON**: Exporta tus paletas de colores generadas o extraídas en formato JSON para usarlas fácilmente en tus proyectos.

---

## 🚀 Arquitectura y Stack Tecnológico

Este proyecto está construido con un enfoque moderno, priorizando el rendimiento, la escalabilidad y una excelente experiencia de desarrollo.

- **Framework Frontend**: **React 19** para una interfaz de usuario declarativa y eficiente.
- **Bundler y Entorno de Desarrollo**: **Vite** para un arranque de servidor de desarrollo instantáneo y un empaquetado optimizado para producción.
- **Lenguaje**: **TypeScript** para añadir seguridad de tipos, mejorar la autocompletación y la mantenibilidad del código.
- **Estilos**: **Styled-components** para escribir CSS-in-JS, permitiendo estilos dinámicos y encapsulados a nivel de componente.
- **Extracción de Colores**: La biblioteca **ColorThief** se utiliza para la funcionalidad de extracción de colores de imágenes.
- **Testing**: **Vitest** y **React Testing Library** para asegurar la fiabilidad y el correcto funcionamiento de los componentes.
- **Linting**: **ESLint** para mantener un código limpio, consistente y libre de errores comunes.

### 📁 Estructura del Proyecto

La estructura de carpetas está organizada para ser intuitiva y escalable:

```
/
├── public/          # Archivos estáticos (íconos, etc.)
├── src/
│   ├── assets/      # Recursos como imágenes y SVGs
│   ├── components/  # Componentes reutilizables de React
│   ├── contexts/    # Contextos de React (ej. ThemeProvider)
│   ├── types/       # Definiciones de tipos de TypeScript
│   └── utils/       # Funciones de utilidad (ej. manipulación de colores)
├── tests/           # Archivos de prueba para Vitest
├── .eslintrc.cjs    # Configuración de ESLint
├── package.json     # Dependencias y scripts del proyecto
└── vite.config.ts   # Configuración de Vite
```

---

## 🛠️ Instalación y Uso Local

Sigue estos pasos para ejecutar el proyecto en tu máquina local:

**1. Clona el repositorio:**

```bash
git clone https://github.com/JPalacio3/GENERADOR-DE-PALETAS-DE-COLORES.git
cd GENERADOR-DE-PALETAS-DE-COLORES
```

**2. Instala las dependencias:**
Se recomienda usar `npm`, pero también puedes usar `yarn` o `pnpm`.

```bash
npm install
```

**3. Inicia el servidor de desarrollo:**
Esto ejecutará la aplicación en modo de desarrollo con Hot-Reload.

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) (o el puerto que indique la terminal) en tu navegador para ver la aplicación.

###📜 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Compila y empaqueta la aplicación para producción en la carpeta `dist/`.
- `npm run lint`: Ejecuta ESLint para analizar el código en busca de errores.
- `npm run preview`: Sirve localmente el build de producción para previsualizarlo.
- `npm run test`: Ejecuta las pruebas con Vitest.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si tienes ideas para nuevas funcionalidades, mejoras o has encontrado un bug, por favor, abre un _issue_ para discutirlo o envía un _pull request_.

---

## 👤 Autor

**JPalacio**

- GitHub: [@JPalacio3](https://github.com/JPalacio3)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
