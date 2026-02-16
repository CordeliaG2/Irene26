🌌 Memory Galaxy Museum

Una experiencia interactiva 3D inspirada en interfaces de consola clásica, donde los recuerdos flotan en forma de galaxia y se desbloquean como si fueran una transmisión especial por horario.

> Un regalo convertido en museo digital.




---

✨ Descripción

Memory Galaxy Museum es una experiencia web desarrollada con Three.js, diseñada para funcionar directamente en GitHub Pages sin backend.

El proyecto combina:

🌠 Una galaxia procedural generada con partículas

📸 Fotografías convertidas en íconos estilo Wii U

🕒 Sistema de desbloqueo por horario (broadcast-style)

🔔 Notificaciones persistentes entre visitas

🎵 Sistema de audio dinámico tipo consola

🖱 Interacción por arrastre y toque

💫 UI inspirada en PS2 / Wii U


No es solo una galería.
Es una experiencia.


---

🧠 Concepto

Inspirado en el sistema Broadcast del Satellaview, los recuerdos aparecen en horarios específicos del día.

Ejemplo conceptual:

02:00 → Aparece un recuerdo

02:05 → Se desbloquea otro

Más tarde → Nuevos mensajes emergen en la galaxia


El usuario puede volver más tarde y encontrar nuevos recuerdos, con notificación automática de cuántos aparecieron desde su última visita.


---

🛠 Tecnologías usadas

Three.js (renderizado 3D)

WebGL

JavaScript ES Modules

Canvas API (textos dinámicos e íconos Wii U)

LocalStorage (persistencia de notificaciones)

Audio API (música y efectos estilo consola)

GitHub Pages (hosting estático)



---

🎮 Estados de la experiencia

El sistema funciona con una máquina de estados:

INTRO → ENTRADA → EXPLORACION

1️⃣ INTRO

Animación tipo consola

Fade in / fade out de textos

Sonido estilo boot


2️⃣ ENTRADA

La galaxia aparece progresivamente

Cámara se acerca al centro

Agujero negro emerge


3️⃣ EXPLORACION

Movimiento orbital dinámico

Fotos desbloqueadas por horario

Interacción con raycaster

Modales de recuerdos

Sistema de notificaciones



---

🔔 Sistema de Broadcast

Cada recuerdo contiene:

{
  foto: './img/1.png',
  miniTexto: 'Feliz cumple ✨',
  mensajeCompleto: '...',
  autor: 'Mari',
  hora: "02:00"
}

El sistema convierte la hora a minutos y compara con la hora real del dispositivo:

getRealMinutes()

Cuando se alcanza la hora:

La foto aparece con animación

Se registra como desbloqueada

Si no es primera visita → muestra notificación



---

💾 Persistencia

Se usan:

localStorage

sessionStorage


Para guardar:

Última visita

Número de recuerdos desbloqueados

Fotos ya vistas

Tutorial mostrado


Todo funciona sin servidor.


---

🎨 Estética

El diseño está inspirado en:

Interfaz Wii U

UI estilo PS2 BIOS

Galaxia tipo Super Mario Galaxy

Menú de consola


Los íconos de fotos se renderizan dinámicamente:

Fondo azul/morado degradado

Bordes redondeados

Gloss superior

Overlay brillante



---

📱 Responsive Design

Optimizado para:

PC (mouse + drag)

Mobile (touch + swipe)

Modo vertical

Modo horizontal

Adaptación de FOV y posición de cámara


Uso de dvh para evitar problemas con barra del navegador móvil.


---

🎵 Sistema de Audio

Incluye:

Sonido de arranque

Música rotativa aleatoria

Fade in / fade out

Sonidos UI (hover, click, open, back)

Protección contra autoplay block



---

🚀 Cómo usar

1. Clonar el repositorio


2. Subir a GitHub


3. Activar GitHub Pages


4. Listo



No requiere backend.


---

🧩 Características técnicas interesantes

Galaxia procedural con 280,000 partículas

Shader personalizado para skybox dinámico

Raycaster para interacción con sprites

Animación con control de FPS

Sistema de desbloqueo desacoplado del render

Arquitectura basada en estados



---

🔮 Posibles mejoras futuras

Sistema para agregar mensajes vía formulario

Eventos especiales de un solo día

Modo historia

Sistema de logros

Versión bullet-hell usando el mismo motor

Editor visual de recuerdos



---

❤️ Propósito

Este proyecto nació como un regalo personalizado.

Más que una demo técnica, es un experimento sobre:

Memoria

Tiempo

Nostalgia digital

Experiencias efímeras en la web



---

📜 Licencia

Proyecto personal.
No destinado a uso comercial.


---