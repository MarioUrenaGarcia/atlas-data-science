---
id: diagrama-de-tallo-y-hojas
titulo: Diagrama de tallo y hojas
titulo_en: Stem-and-leaf plot
alias:
  - tallo y hojas
  - stem and leaf
modulo: 4
submodulo: '4.6'
orden: 5
nivel: basico
prerrequisitos:
  - histograma
etiquetas:
  - visualización
  - distribución
  - datos pequeños
  - análisis exploratorio
resumen: >
  El diagrama de tallo y hojas separa cada número en sus dígitos principales (tallo) y su siguiente
  dígito (hoja). Funciona como un histograma de lado que conserva el valor de cada dato.
formula: '\text{tallo} = \left\lfloor \frac{x}{10u} \right\rfloor, \qquad \text{hoja} = \left\lfloor \frac{x}{u} \right\rfloor \bmod 10'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: tallo
    valores: [62, 75, 81, 68, 79, 90, 73, 85, 77, 66, 88, 71, 93, 58, 84]
    eje:
      variable: Calificación final
referencias:
  - clave: tufte
publicado: true
---

## Intuición

Antes de las computadoras, John Tukey propuso una manera de ver la forma de unos cuantos datos usando solo lápiz y papel. Para calificaciones como 62, 75 y 81, se escriben en una columna las decenas (5, 6, 7, 8, 9) y, a la derecha de cada decena, las unidades de los datos que le corresponden. El 62 se convierte en un 2 en el renglón del 6; el 75, en un 5 en el renglón del 7.

Al terminar, cada renglón es tan largo como el número de datos que contiene, así que el diagrama se ve como un histograma acostado. Pero, a diferencia del histograma, no se pierde ningún dato: con el tallo y la hoja se reconstruye cada número. Por eso el **diagrama de tallo y hojas** es útil con conjuntos pequeños, en clase o en un cuaderno de campo, y permite leer al mismo tiempo la forma, la mediana y los valores extremos.

## Definición

:::definicion[Diagrama de tallo y hojas]
Se elige una **unidad de hoja** $u$ (por ejemplo, 1 o 0.1). Cada dato $x$ se escribe como un **tallo**, $\lfloor x/(10u) \rfloor$, y una **hoja** de un solo dígito, $\lfloor x/u \rfloor \bmod 10$. Los tallos se listan en orden vertical, incluidos los que no tienen hojas, y las hojas de cada tallo se escriben en orden creciente a su derecha. Se acompaña de una **clave** que explica cómo leerlo.
:::

Con la clave "6 | 2 representa 62", el renglón $6 \mid 2\ 6\ 8$ contiene los datos 62, 66 y 68. Para datos con decimales se usa $u = 0.1$, y "6 | 2" representa 6.2.

:::figura[Pesos de 12 recién nacidos con unidad de hoja 0.1 kg: el tallo son los kilogramos y la hoja las décimas.]{componente="ChartGallery"}
```yaml
grafico: tallo
valores: [2.8, 3.1, 3.4, 2.9, 3.6, 3.2, 3.0, 3.8, 3.3, 2.6, 3.5, 4.1]
hoja: 0.1
eje:
  variable: Peso al nacer
  unidad: kg
```
:::

:::nota[Qué significa cada símbolo]
- $x$: dato.
- $u$: unidad de hoja, valor que representa una unidad del dígito hoja.
- $\lfloor \cdot \rfloor$: parte entera, redondeo hacia abajo.
- $10u$: valor que representa una unidad del tallo.
- $\bmod 10$: residuo de la división entre 10, el último dígito.
:::

## Cómo usar la visualización

Los quince datos son calificaciones finales de un grupo. La reproducción los toma en el orden en que se registraron: el encabezado indica en qué tallo cae cada uno y qué hoja aporta, y la hoja nueva se resalta en su renglón. Al final, las hojas de cada renglón se ordenan.

Antes de ordenar, los renglones ya muestran la forma: el renglón del 7 y el del 8 son los más largos. Después de ordenar, la mediana se lee contando: es el octavo dato, 77. La clave bajo el diagrama recuerda cómo convertir tallo y hoja en un número.

## Ejemplo

Calificaciones: 62, 75, 81, 68, 79, 90, 73, 85, 77, 66, 88, 71, 93, 58, 84. Con unidad de hoja 1:

| Tallo | Hojas     |
| ----- | --------- |
| 5     | 8         |
| 6     | 2 6 8     |
| 7     | 1 3 5 7 9 |
| 8     | 1 4 5 8   |
| 9     | 0 3       |

1. Hay 15 datos; la mediana es el octavo: contando desde arriba, 58, 62, 66, 68, 71, 73, 75, **77**.
2. El mínimo es 58 y el máximo 93.
3. La forma es casi simétrica, con el mayor número de datos en los setenta.

:::figura[Las calificaciones del ejemplo, construidas dato por dato.]{componente="ChartGallery"}
```yaml
grafico: tallo
valores: [62, 75, 81, 68, 79, 90, 73, 85, 77, 66, 88, 71, 93, 58, 84]
eje:
  variable: Calificación
```
:::

## Propiedades

- **Conserva cada dato** (con la precisión de la hoja), a diferencia del histograma.
- **Es un histograma de lado** con intervalos de ancho $10u$ y alturas iguales al número de hojas.
- **Facilita los cuantiles:** con las hojas ordenadas, la mediana y los cuartiles se obtienen contando.
- **Solo sirve para pocos datos:** con cientos de observaciones, los renglones se vuelven demasiado largos.

:::figura[Propiedad del histograma de lado: tiempos de 20 corredores en una carrera de 10 km, en minutos. Los renglones más largos marcan donde se concentran los tiempos.]{componente="ChartGallery"}
```yaml
grafico: tallo
valores: [41, 44, 46, 47, 48, 49, 51, 52, 52, 53, 54, 55, 57, 58, 61, 62, 64, 67, 72, 79]
eje:
  variable: Tiempo en 10 km
  unidad: min
```
:::

## Errores comunes

- **Omitir los tallos vacíos.** Si no hay datos en los sesenta, el renglón del 6 debe aparecer vacío; omitirlo junta grupos que están separados.
- **Olvidar la clave.** Sin ella, "4 | 2" puede significar 42, 4.2 o 420.
- **Elegir una unidad de hoja inadecuada.** Con datos de 1000 a 9000 y hoja 1, los tallos son centenares de renglones; conviene redondear y usar hoja de 100.

:::figura[Tallos vacíos: duraciones de 12 trámites con un hueco entre 30 y 50 minutos. Los renglones 3 y 4 sin hojas muestran el hueco.]{componente="ChartGallery"}
```yaml
grafico: tallo
valores: [12, 15, 18, 21, 22, 24, 27, 55, 58, 61, 63, 66]
eje:
  variable: Duración del trámite
  unidad: min
```
:::

## Conexiones

El diagrama de tallo y hojas es un [[histograma]] de lado que conserva los valores, propuesto por Tukey como herramienta de análisis exploratorio de datos. Con las hojas ordenadas se leen directamente la [[mediana]] y los [[cuantiles-cuartiles-deciles-y-percentiles|cuartiles]].

## Formulario

:::formula[Tallo]
$$
\text{tallo} = \left\lfloor \frac{x}{10u} \right\rfloor
$$

- $x$: dato; $u$: unidad de hoja.
:::

:::formula[Hoja]
$$
\text{hoja} = \left\lfloor \frac{x}{u} \right\rfloor \bmod 10
$$

- El residuo entre 10 da el siguiente dígito del dato.
:::

:::formula[Reconstrucción del dato]
$$
x \approx (10 \cdot \text{tallo} + \text{hoja})\,u
$$

- La precisión es la de la unidad de hoja $u$.
:::
