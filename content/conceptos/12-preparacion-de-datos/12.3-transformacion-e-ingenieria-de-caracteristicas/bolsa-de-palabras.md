---
id: bolsa-de-palabras
titulo: Bolsa de palabras
titulo_en: Bag of words
alias:
  - bag of words
  - matriz documento término
  - conteo de palabras
modulo: 12
submodulo: '12.3'
orden: 18
nivel: basico
prerrequisitos:
  - codificacion-one-hot
  - similitud-coseno
etiquetas:
  - texto
  - ingeniería de características
  - conteos
  - representación vectorial
resumen: >
  La bolsa de palabras representa cada documento como el vector de cuántas veces aparece cada palabra del
  vocabulario. Ignora el orden de las palabras y produce una matriz documento término grande y llena de ceros.
formula: 'x_{dt} = \#\{\text{apariciones del término } t \text{ en el documento } d\}'
visualizacion:
  componente: TextFeaturesViz
  parametros:
    modo: bolsa
    corpus: resenas
referencias:
  - clave: murphy
  - clave: james-isl
publicado: true
---

## Intuición

Un restaurante recibe reseñas escritas y quiere clasificarlas como positivas o negativas. Un modelo no lee texto, así que primero hay que convertir cada reseña en números. La forma más directa es contar: hacer la lista de todas las palabras que aparecen en el conjunto de reseñas (el **vocabulario**) y, para cada reseña, anotar cuántas veces aparece cada palabra.

Se llama **bolsa de palabras** porque es como vaciar la reseña en una bolsa: se sabe qué palabras hay y cuántas veces, pero no en qué orden estaban. "La comida estaba rica y el servicio lento" y "el servicio estaba rico y la comida lenta" quedarían casi iguales. A pesar de esa pérdida, la representación funciona bien en muchas tareas, porque la presencia de palabras como "excelente", "fría" o "lento" ya dice mucho. Su costo es el tamaño: con miles de reseñas el vocabulario tiene miles de palabras, y cada reseña usa solo unas cuantas, así que la matriz es enorme y casi toda de ceros.

## Definición

:::definicion[Bolsa de palabras]
Sea un conjunto de $N$ documentos y un vocabulario $V = \{t_1, \dots, t_{|V|}\}$ formado por los términos que aparecen en ellos tras la tokenización. La **bolsa de palabras** representa el documento $d$ con el vector $\mathbf{x}_d \in \mathbb{N}^{|V|}$ de componentes

$$
x_{dt} = \#\{\text{apariciones del término } t \text{ en el documento } d\}.
$$

Las filas $\mathbf{x}_1, \dots, \mathbf{x}_N$ forman la **matriz documento término** $\mathbf{X}$ de $N \times |V|$.
:::

La semejanza entre documentos suele medirse con la similitud coseno, $\cos(\mathbf{x}_d, \mathbf{x}_e) = \mathbf{x}_d^\top \mathbf{x}_e / (\lVert \mathbf{x}_d \rVert\,\lVert \mathbf{x}_e \rVert)$.

:::nota[Qué significa cada símbolo]
- $N$: número de documentos.
- $V$: vocabulario; $|V|$, su tamaño.
- $t$: un término del vocabulario.
- $d$, $e$: documentos.
- $\#\{\cdot\}$: número de elementos del conjunto, es decir, el conteo.
- $x_{dt}$: veces que aparece $t$ en $d$.
- $\mathbf{x}_d$: vector de conteos del documento $d$.
- $\mathbb{N}^{|V|}$: vectores de $|V|$ enteros no negativos.
- $\mathbf{X}$: matriz documento término.
- $\lVert \cdot \rVert$: norma euclidiana.
:::

## Cómo usar la visualización

Arriba están las reseñas, cortadas en palabras. Al reproducir, cada palabra se resalta en su turno y suma uno en la celda de su documento y su término; las celdas más oscuras tienen conteos mayores. El interruptor quita palabras vacías (artículos, conjunciones y preposiciones frecuentes), que aparecen tachadas. Las lecturas muestran el tamaño del vocabulario, la proporción de ceros y la similitud coseno entre las dos primeras reseñas.

Experimento sugerido: comparar la similitud coseno de las reseñas 1 y 2 con y sin palabras vacías. Sin ellas la similitud sube, porque las dos comparten comida, rica y servicio y solo difieren en rápido y lento: la bolsa de palabras no capta que una elogia el servicio y la otra se queja de él.

## Ejemplo

Las dos primeras reseñas son "La comida estaba rica y el servicio rápido" y "El servicio fue lento pero la comida rica".

1. Vocabulario de las cuatro reseñas, en orden de aparición: la, comida, estaba, rica, y, el, servicio, rápido, fue, lento, pero, fría, excelente ($|V| = 13$).
2. Reseña 1: $(1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0)$. Reseña 2: $(1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0)$.
3. Comparten la, comida, rica, el y servicio: $\mathbf{x}_1^\top\mathbf{x}_2 = 5$.
4. Cada una tiene 8 palabras con conteo 1: $\lVert \mathbf{x}_1 \rVert = \lVert \mathbf{x}_2 \rVert = \sqrt{8}$.
5. Similitud coseno: $5/8 = 0.625$, aunque una elogia la rapidez y la otra se queja de la lentitud.

:::figura[Las reseñas sin palabras vacías: el vocabulario se reduce a las palabras con contenido y la similitud entre las dos primeras reseñas sube de 0.625 a 0.750, porque casi todo lo que queda es compartido.]{componente="TextFeaturesViz"}
```yaml
modo: bolsa
corpus: resenas
sinVacias: true
```
:::

## Propiedades

- **Pierde el orden.** Dos textos con las mismas palabras en distinto orden tienen el mismo vector.
- **Es muy dispersa.** Cada documento usa una pequeña fracción del vocabulario; en colecciones grandes, más del 99 % de las celdas son cero.
- **Los documentos largos tienen vectores largos.** Por eso se compara con la similitud coseno, o se normalizan las filas, en lugar de usar distancias euclidianas.

:::figura[Titulares de noticias: los temas de economía y de deportes casi no comparten palabras, y la matriz tiene mayoría de ceros.]{componente="TextFeaturesViz"}
```yaml
modo: bolsa
corpus: noticias
sinVacias: true
```
:::

## Errores comunes

- **Construir el vocabulario con los datos de prueba.** Las palabras de la prueba no deben definir columnas del modelo; el vocabulario se fija con el entrenamiento.
- **Tratar las palabras vacías como información.** Artículos y preposiciones dominan los conteos y aportan coincidencias que nada dicen del contenido; se eliminan o se pesan con tf-idf. Quitarlas no resuelve todo: en el ejemplo, las dos reseñas se parecen todavía más sin ellas, aunque digan cosas opuestas.
- **Esperar que distinga negaciones.** "Es bueno" y "no es bueno" difieren en una sola palabra; la bolsa los considera casi iguales.

:::figura[Error de esperar que distinga negaciones: "el servicio es bueno" y "el servicio no es bueno" quedan con vectores casi iguales.]{componente="TextFeaturesViz"}
```yaml
modo: bolsa
corpus: negacion
```
:::

## Conexiones

Cada palabra del vocabulario es una columna, como en la [[codificacion-one-hot]], y un documento es la suma de los vectores one-hot de sus palabras. Los documentos se comparan con la [[similitud-coseno]] y, con frecuencia, después de la [[normalizacion-por-norma]]. Los pesos [[tf-idf]] corrigen la importancia de las palabras comunes, los [[n-gramas]] recuperan algo del orden y el [[truco-de-hashing]] acota el número de columnas cuando el vocabulario es enorme.

## Formulario

:::formula[Conteo de un término]
$$
x_{dt} = \#\{\text{apariciones del término } t \text{ en el documento } d\}
$$

- $d$: documento; $t$: término; $x_{dt}$: conteo.
:::

:::formula[Similitud coseno entre documentos]
$$
\cos(\mathbf{x}_d, \mathbf{x}_e) = \frac{\mathbf{x}_d^\top \mathbf{x}_e}{\lVert \mathbf{x}_d \rVert\,\lVert \mathbf{x}_e \rVert}
$$

- $\mathbf{x}_d$, $\mathbf{x}_e$: vectores de conteos de dos documentos.
- $\mathbf{x}_d^\top \mathbf{x}_e$: producto punto.
- $\lVert \cdot \rVert$: norma euclidiana.
:::
