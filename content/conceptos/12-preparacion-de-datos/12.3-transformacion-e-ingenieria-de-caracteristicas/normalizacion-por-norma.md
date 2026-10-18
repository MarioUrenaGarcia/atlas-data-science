---
id: normalizacion-por-norma
titulo: Normalización por norma
titulo_en: Normalization to unit norm
alias:
  - normalización por filas
  - normalización L2
  - normalización L1
  - vectores unitarios
modulo: 12
submodulo: '12.3'
orden: 4
nivel: basico
prerrequisitos:
  - similitud-coseno
etiquetas:
  - escalamiento
  - normas
  - textos
  - preprocesamiento
resumen: >
  La normalización por norma divide cada fila (no cada columna) entre su norma L1, L2 o L infinito, para que
  todas las observaciones tengan longitud 1 y se comparen por su dirección, no por su tamaño.
formula: "\\mathbf{x}' = \\frac{\\mathbf{x}}{\\lVert \\mathbf{x} \\rVert_p}"
visualizacion:
  componente: FeatureEngineeringViz
  parametros:
    modo: norma
    caso: textos
    p: '2'
referencias:
  - clave: james-isl
  - clave: murphy
publicado: true
---

## Intuición

Un archivo de documentos cuenta cuántas veces aparece cada palabra. Una nota breve menciona "datos" 3 veces y "modelo" 1 vez; un informe largo sobre el mismo tema menciona "datos" 12 veces y "modelo" 4. Como vectores de conteos, el informe está mucho más lejos del origen, y una distancia euclidiana diría que ambos textos son muy distintos. Pero hablan de lo mismo y en la misma proporción: tres veces más de datos que de modelos. Lo que los distingue es su longitud, no su contenido.

La **normalización por norma** divide cada fila entre su tamaño. Tras dividir, todos los vectores tienen longitud 1 y solo conservan su dirección. La nota y el informe quedan exactamente en el mismo punto. A diferencia del escalamiento por columnas, aquí se trabaja observación por observación: cada documento, cliente o muestra se divide entre su propio total. La elección de la norma decide qué significa "tamaño": la suma de los valores (L1), la longitud euclidiana (L2) o el valor más grande (L infinito).

## Definición

:::definicion[Normalización por norma]
Sea $\mathbf{x} = (x_1, \dots, x_p)$ una fila con $p$ variables. Su **normalización** por la norma $L_p$ es

$$
\mathbf{x}' = \frac{\mathbf{x}}{\lVert \mathbf{x} \rVert_q}, \qquad \lVert \mathbf{x} \rVert_1 = \sum_{k=1}^{p} |x_k|, \quad \lVert \mathbf{x} \rVert_2 = \sqrt{\sum_{k=1}^{p} x_k^2}, \quad \lVert \mathbf{x} \rVert_\infty = \max_k |x_k|.
$$

El resultado cumple $\lVert \mathbf{x}' \rVert_q = 1$: queda sobre la esfera unitaria de esa norma.
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{x}$: fila de datos, un vector con $p$ componentes.
- $x_k$: componente $k$ de la fila.
- $q$: norma elegida: $1$, $2$ o $\infty$.
- $\lVert \mathbf{x} \rVert_q$: norma $q$ de la fila.
- $\mathbf{x}'$: fila normalizada, de norma $1$.
:::

## Cómo usar la visualización

Cada flecha es una fila, por ejemplo un documento con sus conteos de dos palabras. La línea punteada es la parte de la esfera unitaria de la norma elegida que cae en el primer cuadrante: un arco con L2, un segmento diagonal con L1 y un ángulo recto con L infinito. Al reproducir, cada flecha se encoge sobre su propia dirección hasta tocar esa línea. Las lecturas muestran la norma de cada fila.

Experimentos sugeridos: observar que la nota corta y el informe largo terminan en el mismo punto con cualquier norma; cambiar a L1 y ver que las coordenadas normalizadas son proporciones que suman 1.

## Ejemplo

La nota corta tiene conteos $(3, 1)$ y el informe largo $(12, 4)$.

1. Normas L2: $\sqrt{3^2 + 1^2} = \sqrt{10} = 3.162$ y $\sqrt{12^2 + 4^2} = \sqrt{160} = 12.649$.
2. Normalizados: $(3, 1)/3.162 = (0.949,\ 0.316)$ y $(12, 4)/12.649 = (0.949,\ 0.316)$. Son idénticos.
3. Con L1: normas $4$ y $16$, y ambos quedan en $(0.75,\ 0.25)$: el 75 % de las menciones son de "datos".
4. La distancia euclidiana entre los originales es $\sqrt{9^2 + 3^2} = 9.49$; entre los normalizados, $0$.

:::figura[Normalización L1 de los mismos textos: cada fila se convierte en proporciones que suman 1 y queda sobre el segmento diagonal.]{componente="FeatureEngineeringViz"}
```yaml
modo: norma
caso: textos
p: '1'
```
:::

## Propiedades

- **Con L2, el producto punto de filas normalizadas es la similitud coseno.** Por eso es la normalización habitual antes de comparar textos o embeddings.
- **Es invariante a la escala de cada fila.** Multiplicar una fila por una constante positiva no cambia su versión normalizada.
- **No usa información de otras filas.** A diferencia del escalamiento por columnas, no hay estadísticos de entrenamiento que puedan filtrar información.

:::figura[Composición de alimentos por porción con L1: cada alimento queda descrito por la proporción de proteína y grasa, sin importar el tamaño de la porción.]{componente="FeatureEngineeringViz"}
```yaml
modo: norma
caso: dietas
p: '1'
```
:::

:::figura[Con la norma L infinito, cada fila se divide entre su componente más grande y queda sobre los lados del cuadrado unitario.]{componente="FeatureEngineeringViz"}
```yaml
modo: norma
caso: dietas
p: inf
```
:::

## Errores comunes

- **Confundirla con el escalamiento de columnas.** Normalizar filas no pone a las variables en la misma escala; si una columna se mide en miles y otra en unidades, la primera seguirá dominando la dirección.
- **Usarla cuando el tamaño importa.** Si el número total de compras de un cliente es información relevante, normalizar por fila la borra.
- **Normalizar filas de ceros.** Una fila con todos los valores en cero no tiene dirección y su norma es cero; hay que tratarla aparte.

## Conexiones

Usa las [[normas-vectoriales]] L1, L2 e infinito, y con L2 convierte el [[producto-punto]] en la [[similitud-coseno]]. Se aplica sobre todo a conteos como los de la [[bolsa-de-palabras]] y los pesos de [[tf-idf]]. Para escalar columnas en lugar de filas se usan el [[escalamiento-min-max]] o la [[estandarizacion]].

## Formulario

:::formula[Fila normalizada]
$$
\mathbf{x}' = \frac{\mathbf{x}}{\lVert \mathbf{x} \rVert_q}
$$

- $\mathbf{x}$: fila original; $\mathbf{x}'$: fila de norma $1$.
- $q$: norma usada.
:::

:::formula[Normas L1, L2 e infinito]
$$
\lVert \mathbf{x} \rVert_1 = \sum_{k} |x_k|, \qquad \lVert \mathbf{x} \rVert_2 = \sqrt{\sum_{k} x_k^2}, \qquad \lVert \mathbf{x} \rVert_\infty = \max_k |x_k|
$$

- $x_k$: componente $k$ de la fila.
:::

:::formula[Similitud coseno con filas normalizadas en L2]
$$
\cos\theta = \mathbf{x}'^\top \mathbf{y}'
$$

- $\mathbf{x}'$, $\mathbf{y}'$: dos filas normalizadas con la norma L2.
- $\theta$: ángulo entre las filas originales.
:::
