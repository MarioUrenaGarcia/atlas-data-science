---
id: perfilado-de-datos
titulo: Perfilado de datos
titulo_en: Data profiling
alias:
  - perfil de datos
  - resumen por columna
  - data profiling
modulo: 4
submodulo: '4.7'
orden: 7
nivel: basico
prerrequisitos:
  - analisis-univariado
etiquetas:
  - calidad de datos
  - exploración
  - tipos de datos
  - completitud
resumen: >
  El perfilado de datos resume cada columna de una tabla con su tipo, completitud, número de valores
  distintos, rango y valores más frecuentes, para detectar errores, códigos especiales y problemas de
  calidad antes de analizar.
formula: '\text{completitud}_j = 1 - \frac{\text{faltantes}_j}{n},\qquad \text{cardinalidad}_j = \#\{\text{valores distintos en } j\}'
visualizacion:
  componente: DataQualityTable
  parametros:
    modo: perfilado
referencias:
  - clave: james-isl
publicado: true
---

## Intuición

Antes de mirar una sola gráfica de las ventas de viviendas, conviene saber qué hay en el archivo. ¿Cuántas filas y columnas? ¿Cada columna tiene el tipo esperado, números donde debe haber números? ¿Cuántos valores faltan en cada una? ¿Cuántos valores distintos tiene la zona: tres, como se esperaba, o cinco porque alguien escribió "sur" y "SUR"? ¿El mínimo y el máximo de la superficie son razonables?

El **perfilado de datos** responde esas preguntas columna por columna con un resumen breve: tipo, completitud, cardinalidad, rango o categorías más frecuentes, y una pequeña gráfica. Es una revisión rápida y sistemática, como el inventario que se hace al recibir una mercancía. En las viviendas, el perfil revela de inmediato que la antigüedad tiene 27 faltantes y que la superficie llega hasta 1210 m², dos hallazgos que guiarán el resto del análisis.

## Definición

:::definicion[Perfilado de datos]
Para una tabla con $n$ filas y columnas $j = 1, \dots, p$, el **perfil** de la columna $j$ reporta:

1. **Tipo:** numérica o categórica (y, en la práctica, fecha, texto libre, identificador).
2. **Completitud:** número de faltantes y proporción $1 - \text{faltantes}_j / n$.
3. **Cardinalidad:** número de valores distintos.
4. Para numéricas: mínimo, máximo, media, mediana y una distribución resumida.
5. Para categóricas: moda y frecuencias de las categorías más comunes.
:::

Con el perfil se buscan señales de problemas: tipos inesperados, categorías duplicadas por mayúsculas o acentos, valores centinela como $-999$ o $0$ usados para indicar faltantes, columnas constantes, identificadores repetidos y rangos imposibles.

:::nota[Qué significa cada símbolo]
- $n$: número de filas; $p$: número de columnas; $j$: índice de la columna.
- $\text{faltantes}_j$: número de celdas vacías en la columna $j$.
- $\text{completitud}_j$: proporción de celdas con valor.
- $\text{cardinalidad}_j$: número de valores distintos en la columna.
- $\#\{\cdot\}$: número de elementos del conjunto.
:::

## Cómo usar la visualización

Arriba se muestran las primeras filas de las ventas de viviendas, con los valores faltantes marcados. Al reproducir, cada columna recibe su tarjeta de perfil: tipo, faltantes, distintos, rango o moda y una pequeña gráfica de su distribución. El encabezado resume la columna en curso.

Experimentos sugeridos:

1. Detenerse en la superficie: el máximo de 1210 m² es sospechoso frente a una mediana de 91.
2. En la antigüedad, leer la completitud: 27 faltantes de 200, un 13.5 %.
3. En la zona, comprobar que la cardinalidad es 3: no hay categorías duplicadas.

## Ejemplo

Perfil de una columna de edad con diez registros: 34, 29, nulo, 41, 29, 0, 55, 29, nulo y 38.

1. Tipo: numérica.
2. Faltantes: 2, completitud $1 - 2/10 = 0.8$.
3. Valores observados: 34, 29, 41, 29, 0, 55, 29 y 38; distintos: 6.
4. Rango: de 0 a 55; moda 29 (tres veces).
5. Señal de alerta: una edad de 0 en un registro de clientes adultos sugiere un valor centinela usado para "sin dato". La completitud real sería $7/10$.

:::figura[El perfil de la columna del ejemplo junto con otras dos columnas de la misma tabla.]{componente="DataQualityTable"}
```yaml
modo: perfilado
columnas:
  - nombre: Edad
    valores: [34, 29, null, 41, 29, 0, 55, 29, null, 38]
  - nombre: Ciudad
    valores: [Monterrey, Puebla, Monterrey, León, Puebla, Monterrey, León, Monterrey, Puebla, León]
  - nombre: Compras
    valores: [3, 1, 4, 2, 5, 1, 2, 6, 3, 2]
filas: 10
```
:::

## Propiedades

- **Se calcula sin supuestos** sobre la distribución; solo cuenta, ordena y resume.
- **Escala bien:** cada columna se perfila por separado, de modo que sirve para tablas con miles de columnas.
- **Detecta problemas que las gráficas no muestran,** como faltantes y categorías duplicadas.

:::figura[Categorías duplicadas: la misma ciudad escrita de tres maneras infla la cardinalidad a 5 en lugar de 3.]{componente="DataQualityTable"}
```yaml
modo: perfilado
columnas:
  - nombre: Ciudad
    valores: [Ciudad de México, CDMX, Guadalajara, cdmx, Mérida, Guadalajara, Ciudad de México, Mérida, CDMX, Guadalajara]
  - nombre: Ventas
    valores: [120, 98, 75, 101, 64, 80, 115, 70, 92, 78]
filas: 10
```
:::

## Errores comunes

- **Confiar en el tipo declarado.** Una columna numérica que llega como texto ("1,200") no se puede promediar; el perfil lo revela.
- **No buscar valores centinela.** Códigos como $-999$, $0$ o "NA" escritos como texto no cuentan como faltantes y distorsionan medias y rangos.
- **Ignorar columnas constantes o casi constantes.** No aportan información y pueden causar problemas en modelos.

:::figura[Valor centinela: temperaturas con el código -999 usado para "sin lectura". El mínimo y la media del perfil delatan el problema.]{componente="DataQualityTable"}
```yaml
modo: perfilado
columnas:
  - nombre: Temperatura (°C)
    valores: [21.4, 22.1, -999, 23.0, 22.7, -999, 21.9, 22.3, 23.4, 22.0]
  - nombre: Estación
    valores: [Norte, Norte, Sur, Sur, Norte, Sur, Norte, Sur, Norte, Sur]
filas: 10
```
:::

## Conexiones

El perfilado es la primera revisión del [[analisis-exploratorio-de-datos]] y aplica el [[analisis-univariado]] a todas las columnas a la vez. Depende de distinguir [[datos-cualitativos-y-cuantitativos]] y prepara el estudio de los [[patrones-de-valores-faltantes]] y de los atípicos con la [[deteccion-de-valores-atipicos-por-rango-intercuartilico|regla del rango intercuartílico]].

## Formulario

:::formula[Completitud de una columna]
$$
\text{completitud}_j = 1 - \frac{\text{faltantes}_j}{n}
$$

- $\text{faltantes}_j$: celdas vacías de la columna $j$; $n$: número de filas.
:::

:::formula[Cardinalidad]
$$
\text{cardinalidad}_j = \#\{\text{valores distintos en } j\}
$$

- $\#\{\cdot\}$: número de elementos distintos.
:::

:::formula[Proporción de la moda]
$$
\frac{n_{\text{moda}}}{n - \text{faltantes}_j}
$$

- $n_{\text{moda}}$: veces que aparece el valor más frecuente; en el denominador, número de valores observados.
:::
