---
id: codificacion-de-huffman
titulo: Codificación de Huffman
titulo_en: Huffman coding
alias:
  - código de Huffman
  - árbol de Huffman
  - código prefijo óptimo
modulo: 0
submodulo: '0.8'
orden: 12
nivel: intermedio
prerrequisitos:
  - entropia-de-shannon
etiquetas:
  - compresión
  - códigos prefijo
  - algoritmos voraces
  - teoría de la información
resumen: >
  El algoritmo de Huffman construye el código prefijo de menor longitud media uniendo, paso a paso,
  los dos grupos de símbolos menos probables. Su longitud media está entre H y H + 1 bits.
formula: 'H(X) \le L_{\text{Huffman}} = \sum_i p_i\,\ell_i < H(X) + 1'
visualizacion:
  componente: InformationViz
  parametros:
    modo: huffman
    p: [0.45, 0.25, 0.15, 0.1, 0.05]
    etiquetas: [A, C, G, T, N]
referencias:
  - clave: cover-thomas
    capitulo: '5'
publicado: true
---

## Intuición

En el código Morse la letra más frecuente del inglés, la E, es un solo punto, y las letras raras usan cuatro señales. La idea es dar palabras cortas a los símbolos frecuentes y largas a los raros, para que en promedio el mensaje ocupe poco. El problema es hacerlo de manera óptima y sin ambigüedad.

Un código prefijo es uno en el que ninguna palabra es el inicio de otra; así se puede decodificar leyendo de izquierda a derecha sin separadores. Todo código prefijo binario corresponde a un árbol: cada símbolo es una hoja y su palabra es el camino desde la raíz, con 0 a la izquierda y 1 a la derecha.

Huffman descubrió que el mejor árbol se construye desde las hojas: se toman los dos símbolos menos probables, se unen como hermanos y se tratan como un solo símbolo con la suma de sus probabilidades. Se repite hasta que queda un solo grupo. Los símbolos raros, que se unen primero, quedan en lo más profundo del árbol y reciben las palabras más largas.

## Definición

:::definicion[Algoritmo de Huffman]
Sea $X$ una variable con valores $x_1, \dots, x_k$ de probabilidades $p_1, \dots, p_k$.

1. Se forma un grupo por cada símbolo, con peso igual a su probabilidad.
2. Mientras haya más de un grupo, se eligen los dos de menor peso, se antepone 0 a las palabras de los símbolos de uno y 1 a las del otro, y se reemplazan por un grupo cuyo peso es la suma.
3. Al quedar un solo grupo, cada símbolo $x_i$ tiene su palabra, de longitud $\ell_i$.

La longitud media del código es $L = \sum_{i=1}^{k} p_i \ell_i$.
:::

Ningún código prefijo binario para $X$ tiene longitud media menor que la del código de Huffman.

:::nota[Qué significa cada símbolo]
- $X$: variable que se codifica; $x_i$: sus valores o símbolos.
- $k$: número de símbolos.
- $p_i$: probabilidad del símbolo $x_i$.
- $\ell_i$: longitud en bits de la palabra de $x_i$.
- $L$: longitud media del código en bits por símbolo.
:::

## Cómo usar la visualización

Arriba se muestran los grupos activos con su peso; los dos que se unirán en el siguiente paso aparecen resaltados. La tabla de abajo lista cada símbolo con su probabilidad y su palabra parcial, que crece por la izquierda con cada unión. La reproducción hace una unión por paso.

Con las frecuencias de bases (0.45, 0.25, 0.15, 0.1, 0.05), la primera unión junta T y N en un grupo de peso 0.15, la segunda lo une con G y forma 0.3, y así hasta la raíz. Al terminar, el código es A = 0, C = 10, G = 110, T = 1111 y N = 1110, con longitud media de 2 bits contra una entropía de 1.977.

## Ejemplo

Una estación meteorológica transmite cinco estados con probabilidades: soleado 0.4, nublado 0.2, lluvia 0.2, tormenta 0.1 y granizo 0.1.

1. Se unen tormenta y granizo (0.1 + 0.1 = 0.2).
2. Quedan pesos 0.4, 0.2, 0.2 y 0.2; se unen nublado y lluvia (0.4).
3. Quedan 0.4, 0.2 y 0.4; se unen el grupo de tormenta y granizo con soleado (0.6).
4. Se unen los dos grupos restantes (1).
5. Palabras resultantes: soleado 11, nublado 00, lluvia 01, tormenta 100 y granizo 101.
6. Longitud media: $0.4 \cdot 2 + 0.2 \cdot 2 + 0.2 \cdot 2 + 0.1 \cdot 3 + 0.1 \cdot 3 = 2.2$ bits, frente a $H = 2.122$ bits y a los 3 bits de un código de longitud fija.

:::figura[Los cinco estados del clima: cuatro uniones producen las palabras 11, 00, 01, 100 y 101, con longitud media 2.2 bits contra una entropía de 2.122.]{componente="InformationViz"}
```yaml
modo: huffman
p: [0.4, 0.2, 0.2, 0.1, 0.1]
etiquetas: [sol, nub, llu, tor, gra]
```
:::

## Propiedades

- **Optimalidad:** el código de Huffman minimiza $L$ entre todos los códigos prefijo binarios.
- **Cotas:** $H(X) \le L < H(X) + 1$.
- **Caso diádico:** si todas las probabilidades son potencias de $1/2$, entonces $\ell_i = -\log_2 p_i$ y $L = H(X)$ exactamente.

:::figura[Probabilidades 1/2, 1/4, 1/8 y 1/8: las palabras miden 1, 2, 3 y 3 bits, iguales a las sorpresas de cada símbolo, y la longitud media coincide con la entropía, 1.75 bits.]{componente="InformationViz"}
```yaml
modo: huffman
p: [0.5, 0.25, 0.125, 0.125]
etiquetas: [a, b, c, d]
```
:::

- **Desigualdad de Kraft:** las longitudes de cualquier código prefijo binario cumplen $\sum_i 2^{-\ell_i} \le 1$; el de Huffman la cumple con igualdad.
- **No unicidad:** con empates entre pesos hay varios códigos de Huffman distintos, todos con la misma longitud media.

## Errores comunes

- **Esperar que Huffman alcance la entropía con pocos símbolos muy desiguales.** Cada palabra mide al menos un bit, así que con una fuente binaria de probabilidades 0.9 y 0.1 el código gasta 1 bit por símbolo aunque la entropía sea 0.469. Para acercarse a $H$ hay que codificar bloques de símbolos.

:::figura[Fuente binaria con 0.9 y 0.1: una sola unión da las palabras 1 y 0, con longitud media 1 bit, más del doble de la entropía de 0.469 bits.]{componente="InformationViz"}
```yaml
modo: huffman
p: [0.9, 0.1]
etiquetas: [a, b]
```
:::

- **Unir los símbolos más probables.** El algoritmo une siempre los dos de menor peso; unir los grandes produce palabras largas para los símbolos frecuentes.
- **Olvidar que el código depende de las probabilidades.** Un código diseñado para una distribución $q$ y usado con datos de otra $p$ pierde eficiencia: con longitudes $\lceil -\log_2 q(x) \rceil$ el gasto medio queda entre $H(p, q)$ y $H(p, q) + 1$, y un código de Huffman para $q$ puede gastar todavía más.
- **Confundir longitud media con longitud máxima.** Huffman minimiza el promedio ponderado; algunas palabras raras pueden ser muy largas.

## Conexiones

La [[entropia-de-shannon]] es la cota inferior de su longitud media, y el [[teorema-de-codificacion-de-fuente]] muestra cómo acercarse a ella codificando bloques. Si el código se diseña con un modelo equivocado, el costo es la [[entropia-cruzada]]. Es un ejemplo clásico de algoritmo voraz cuyo resultado es óptimo.

## Formulario

:::formula[Longitud media]
$$
L = \sum_{i=1}^{k} p_i\,\ell_i
$$

- $p_i$: probabilidad del símbolo $i$; $\ell_i$: longitud de su palabra; $k$: número de símbolos.
:::

:::formula[Cotas de Huffman]
$$
H(X) \le L < H(X) + 1
$$

- $H(X)$: entropía de la fuente en bits; $L$: longitud media del código de Huffman.
:::

:::formula[Desigualdad de Kraft]
$$
\sum_{i=1}^{k} 2^{-\ell_i} \le 1
$$

- $\ell_i$: longitudes de las palabras de un código prefijo binario.
:::
