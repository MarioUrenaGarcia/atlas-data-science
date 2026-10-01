---
id: datos-estructurados-semiestructurados-y-no-estructurados
titulo: Datos estructurados, semiestructurados y no estructurados
titulo_en: Structured, semi-structured and unstructured data
alias:
  - datos tabulares
  - datos no tabulares
  - JSON
  - texto libre
modulo: 4
submodulo: '4.1'
orden: 7
nivel: basico
prerrequisitos:
  - datos-cualitativos-y-cuantitativos
etiquetas:
  - estructura de datos
  - datos tabulares
  - texto
  - esquema
  - extracción de variables
resumen: >
  Los datos estructurados vienen en una tabla con columnas fijas; los semiestructurados traen
  etiquetas con un esquema flexible; los no estructurados, como texto e imágenes, no tienen campos.
formula: '\text{texto o registro} \xrightarrow{\ \text{extracción}\ } (x_{i1}, x_{i2}, \dots, x_{ip})'
visualizacion:
  componente: DataTypesViz
  parametros:
    modo: estructura
    caso: resenas
referencias:
  - clave: murphy
    capitulo: '1'
publicado: true
---

## Intuición

La misma opinión sobre unos audífonos puede llegar de tres maneras. En una hoja de cálculo, con columnas "producto", "calificación" y "fecha", cada dato está en su lugar y se puede promediar de inmediato. En un registro con etiquetas, como los que intercambian las aplicaciones, cada dato viene con su nombre ("calificacion": 4), pero cada registro puede traer campos distintos o anidados. Y en un párrafo escrito por el cliente ("les daría cuatro estrellas y sí los recomendaría") toda la información está ahí, pero nadie la ha puesto en columnas.

Esos son los datos **estructurados**, **semiestructurados** y **no estructurados**. Los métodos estadísticos clásicos trabajan con tablas; por eso gran parte del trabajo con datos consiste en llevar la información de las formas menos estructuradas a una tabla, decidiendo qué variables extraer y cómo medirlas. Cada paso de extracción es una decisión que puede introducir errores.

## Definición

:::definicion[Grado de estructura]
- **Datos estructurados:** se organizan en una tabla con un esquema fijo, donde cada fila es una unidad $i$ y cada una de las $p$ columnas es una variable con un tipo definido: $(x_{i1}, \dots, x_{ip})$.
- **Datos semiestructurados:** cada registro contiene pares etiqueta y valor, posiblemente anidados o con campos opcionales, sin un esquema rígido común (por ejemplo, registros JSON o XML).
- **Datos no estructurados:** no tienen campos definidos: texto libre, imágenes, audio, video. Para analizarlos estadísticamente se debe definir una **extracción** que los convierta en variables.
:::

La estructura se refiere a la forma de almacenamiento, no al contenido: una imagen contiene muchísima información, pero no en columnas. La extracción de variables a partir de datos no estructurados, como contar palabras, detectar temas o medir el brillo de una imagen, produce datos estructurados.

:::figura[La lectura de una estación meteorológica en tres formas. Un campo, la lluvia, solo aparece en la nota de voz transcrita.]{componente="DataTypesViz"}
```yaml
modo: estructura
caso: sensores
```
:::

:::nota[Qué significa cada símbolo]
- $i$: índice de la unidad o registro.
- $p$: número de variables (columnas) de la tabla.
- $x_{ij}$: valor de la variable $j$ en la unidad $i$.
- $(x_{i1}, \dots, x_{ip})$: fila completa de la unidad $i$.
- La flecha con la palabra "extracción" representa el procedimiento que convierte un registro o un texto en una fila de la tabla.
:::

## Cómo usar la visualización

La visualización presenta una reseña de un producto en tres formas: arriba, la tabla estructurada, vacía al inicio; abajo, el registro con etiquetas y el texto libre. La reproducción llena la tabla columna por columna y resalta dónde está cada valor en las otras dos formas.

En el registro, el valor aparece junto a una etiqueta que lo nombra. En el texto hay que interpretar frases como "cuatro estrellas" o "en marzo" para obtener 4 y 3. El último campo, si el cliente recomienda el producto, no existe en el registro: solo el texto lo contiene. El panel cuenta cuántos campos tienen etiqueta y cuántos solo aparecen en el texto.

## Ejemplo

Una tienda en línea recibe el correo: "Hola, soy el cliente C-2031. Pedí tres artículos por 1,250 pesos con envío exprés, pero el paquete llegó con la caja dañada." Se quiere una fila con cinco variables.

1. Cliente: se lee "C-2031". Variable cualitativa.
2. Artículos: "tres" se convierte en el número 3. Variable cuantitativa discreta.
3. Total: "1,250 pesos" se convierte en 1250. Cuantitativa.
4. Envío: "exprés" es una categoría. Cualitativa.
5. Queja: "llegó con la caja dañada" se codifica como sí. Esta variable exige interpretar el texto; otra persona podría codificar de forma distinta una frase ambigua.

La fila resultante es (C-2031, 3, 1250, exprés, sí). El registro etiquetado del mismo pedido trae las cuatro primeras variables directamente, pero no la queja, que solo existe en el correo.

:::figura[El pedido del ejemplo: tabla, registro etiquetado y correo del cliente.]{componente="DataTypesViz"}
```yaml
modo: estructura
caso: pedidos
```
:::

## Propiedades

- **Espectro, no categorías cerradas.** Una hoja de cálculo con una columna de comentarios libres es estructurada en casi todo y no estructurada en esa columna.
- **Costo de la extracción.** Pasar de no estructurado a estructurado requiere decisiones de medición (qué contar, cómo codificar) que determinan qué se puede concluir después.
- **Esquema flexible.** En los datos semiestructurados, los campos opcionales se convierten en valores faltantes al pasar a una tabla, y los campos anidados o las listas pueden dar lugar a varias filas.

:::figura[Propiedad del espectro: fuentes de datos ordenadas según su grado de estructura.]{componente="DataTypesViz"}
```yaml
modo: clasificar
eje: estructura
ejemplos:
  - nombre: Nómina de empleados
    valores: nombre, puesto, sueldo
    clase: estructurado
    razon: Columnas fijas y un tipo por columna.
  - nombre: Respuestas de una aplicación web
    valores: registros JSON
    clase: semiestructurado
    razon: Cada respuesta trae etiquetas, algunas opcionales o anidadas.
  - nombre: Radiografías de tórax
    valores: imágenes de 2000 x 2000 píxeles
    clase: no-estructurado
    razon: Sin campos; hay que extraer variables de la imagen.
  - nombre: Grabaciones del centro de atención
    valores: archivos de audio
    clase: no-estructurado
    razon: Información sin campos definidos.
  - nombre: Correos con encabezados
    valores: remitente, fecha, cuerpo
    clase: semiestructurado
    razon: Los encabezados tienen etiquetas; el cuerpo es texto libre.
  - nombre: Registro de temperatura por hora
    valores: fecha, hora, grados
    clase: estructurado
    razon: Una tabla con esquema fijo.
```
:::

## Errores comunes

- **Pensar que no estructurado significa sin información o desordenado.** Un texto tiene gramática y una imagen tiene píxeles ordenados; lo que falta son variables definidas para el análisis.
- **Olvidar que la extracción es una medición.** Un contador de palabras negativas es un instrumento con errores: la frase "no está nada mal" contiene palabras negativas y expresa una opinión positiva.
- **Suponer que un archivo JSON es una tabla.** Los campos que faltan en algunos registros y las listas anidadas deben resolverse explícitamente al construir la tabla.

:::figura[Casos engañosos: la apariencia del archivo no decide la estructura; lo que importa es si los valores están en campos definidos.]{componente="DataTypesViz"}
```yaml
modo: clasificar
eje: estructura
ejemplos:
  - nombre: Tabla escaneada en PDF
    valores: imagen de una tabla impresa
    clase: no-estructurado
    razon: Aunque se ve como tabla, el archivo guarda píxeles; hay que reconocer el texto y las celdas.
  - nombre: Hoja de cálculo de quejas
    valores: fecha, sucursal, comentario
    clase: estructurado
    razon: Columnas fijas; la columna de comentario contiene texto libre que requerirá extracción.
  - nombre: Archivo de registro de un servidor
    valores: líneas con fecha, nivel y mensaje
    clase: semiestructurado
    razon: Cada línea sigue un patrón con partes reconocibles, pero el mensaje varía.
  - nombre: Fotografías de hojas de cultivo
    valores: 5000 imágenes
    clase: no-estructurado
    razon: La variable de interés, si la hoja está enferma, no está escrita en ningún campo.
```
:::

## Conexiones

Las variables extraídas se clasifican después como [[datos-cualitativos-y-cuantitativos|cualitativas o cuantitativas]]. El destino de la extracción suele ser una tabla de [[unidad-de-observacion-y-datos-ordenados|datos ordenados]], con una fila por unidad de observación. Los datos no estructurados son la materia prima de métodos que aprenden sus propias variables, como las redes neuronales para imágenes y texto.

## Formulario

:::formula[Fila de una tabla estructurada]
$$
(x_{i1}, x_{i2}, \dots, x_{ip})
$$

- $x_{ij}$: valor de la variable $j$ para la unidad $i$.
- $p$: número de variables.
:::

:::formula[Extracción]
$$
\text{registro o texto de la unidad } i \ \longmapsto\ (x_{i1}, \dots, x_{ip})
$$

- La correspondencia es un procedimiento de medición definido por quien analiza.
- $p$: número de variables que se deciden extraer.
:::
