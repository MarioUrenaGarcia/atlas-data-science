# Política de seguridad

## Alcance

El Atlas de Data Science es un sitio estático: no tiene servidor, cuentas de usuario, cookies ni llamadas a servicios externos. El único dato que guarda es el progreso de estudio, y lo guarda en el almacenamiento local del navegador de cada persona.

Interesan en particular:

- Inyección de HTML o JavaScript a través del contenido, los parámetros de la URL o el archivo de progreso importado.
- Formas de evadir la política de seguridad de contenido del sitio publicado.
- Riesgos en la cadena de suministro: dependencias, flujos de trabajo de GitHub Actions o el proceso de despliegue.

## Cómo reportar una vulnerabilidad

Los reportes se envían mediante el reporte privado de vulnerabilidades de GitHub: pestaña **Security** del repositorio, opción **Report a vulnerability**. Los problemas de seguridad no se reportan en issues públicos.

Conviene incluir la versión o commit afectado, los pasos para reproducir el problema y el impacto observado.

## Versiones con soporte

Solo recibe correcciones la versión publicada desde la rama `main`.
