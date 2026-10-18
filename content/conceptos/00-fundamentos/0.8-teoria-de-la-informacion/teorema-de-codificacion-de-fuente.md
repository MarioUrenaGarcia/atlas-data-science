---
id: teorema-de-codificacion-de-fuente
titulo: Teorema de codificación de fuente
titulo_en: Source coding theorem
alias:
  - primer teorema de Shannon
  - teorema de codificación sin ruido
  - límite de compresión
modulo: 0
submodulo: '0.8'
orden: 13
nivel: intermedio
prerrequisitos:
  - codificacion-de-huffman
etiquetas:
  - compresión
  - entropía
  - códigos por bloques
  - teoría de la información
resumen: >
  Ningún código sin pérdida describe una fuente con menos de H bits por símbolo en promedio, y
  codificando bloques de n símbolos se logra H + 1/n. La entropía es el límite exacto de la compresión.
formula: 'H(X) \le \frac{L_n}{n} < H(X) + \frac{1}{n}'
visualizacion:
  componente: InformationViz
  parametros:
    modo: fuente
    p: 0.1
    bloque: 1
referencias:
  - clave: cover-thomas
    capitulo: '5'
publicado: true
---

## Intuición

Un sensor de una línea de producción envía 0 cuando la pieza está bien y 1 cuando tiene defecto, y solo una de cada diez piezas tiene defecto. Mandar un bit por pieza parece obligatorio, pero es un desperdicio: casi todos los bits son ceros predecibles. Si en lugar de pieza por pieza se codifican grupos de varias piezas, los grupos de puros ceros, que son los más frecuentes, pueden recibir palabras muy cortas.

El teorema de codificación de fuente dice hasta dónde se puede llegar. Por un lado, ningún código que permita recuperar exactamente los datos gasta en promedio menos de $H$ bits por símbolo, la entropía de la fuente. Por otro, ese límite se puede alcanzar tanto como se quiera: codificando bloques de $n$ símbolos con un código óptimo, el gasto por símbolo queda por debajo de $H + 1/n$. Para el sensor, $H = 0.469$ bits por pieza, así que la información real cabe en menos de la mitad de los bits ingenuos.

## Definición

:::teorema[Teorema de codificación de fuente]
Sean $X_1, X_2, \dots$ independientes con la misma distribución discreta y entropía $H(X)$. Para cada código prefijo binario de los bloques $(X_1, \dots, X_n)$ con longitud media $L_n$,
$$
\frac{L_n}{n} \ge H(X).
$$
Además, el código de Huffman de los bloques cumple
$$
H(X) \le \frac{L_n}{n} < H(X) + \frac{1}{n},
$$
de modo que $L_n / n \to H(X)$ cuando $n \to \infty$.
:::

La versión asintótica con errores dice que, para todo $\varepsilon > 0$, con $n(H + \varepsilon)$ bits se describen los bloques salvo un conjunto de probabilidad que tiende a cero, y con $n(H - \varepsilon)$ bits la probabilidad de error tiende a uno.

:::nota[Qué significa cada símbolo]
- $X_1, X_2, \dots$: símbolos de la fuente, independientes y con la misma distribución.
- $H(X)$: entropía de cada símbolo en bits.
- $n$: tamaño del bloque.
- $L_n$: longitud media del código para bloques de $n$ símbolos.
- $L_n / n$: bits por símbolo.
- $\varepsilon$: margen arbitrario positivo.
:::

## Cómo usar la visualización

El eje horizontal es el tamaño del bloque $n$ y el vertical, bits por símbolo. La línea continua es la entropía $H$ y la punteada, la cota $H + 1/n$. Cada punto es la longitud por símbolo $L_n/n$ del código de Huffman construido para los $2^n$ bloques posibles. La reproducción agrega un tamaño de bloque por paso, de 1 a 6.

Para la fuente con $P(1) = 0.1$ los puntos son 1, 0.645, 0.533, 0.493, 0.480 y 0.470, siempre entre las dos curvas y cada vez más cerca de $H = 0.469$. Con bloques de 6 piezas, el código gasta solo 0.001 bits por pieza más que la entropía.

## Ejemplo

Se codifica la fuente binaria con $P(1) = 0.1$ por pares de símbolos.

1. Probabilidades de los cuatro pares: $00$: 0.81, $01$: 0.09, $10$: 0.09 y $11$: 0.01.
2. Huffman une $11$ con uno de los pares de 0.09 (0.1), luego con el otro par de 0.09 (0.19) y por último con $00$.
3. Longitudes: $00$ recibe 1 bit, un par de 0.09 recibe 2 y los otros dos pares, 3.
4. $L_2 = 0.81 \cdot 1 + 0.09 \cdot 2 + 0.09 \cdot 3 + 0.01 \cdot 3 = 1.29$ bits por par, es decir, $0.645$ bits por símbolo.
5. La cota garantiza $0.469 \le 0.645 < 0.469 + 0.5 = 0.969$.

Comparado con un bit por símbolo, los pares ya ahorran 35.5 %.

:::figura[Fuente con P(1) = 0.1 partiendo de bloques de 2: el primer punto vale 1 y el segundo 0.645, ya por debajo de la cota de 0.969; los siguientes bajan hacia 0.469.]{componente="InformationViz"}
```yaml
modo: fuente
p: 0.1
bloque: 2
```
:::

## Propiedades

- **Cota inferior universal:** ningún código prefijo, y en general ningún código de decodificación única, tiene longitud media menor que la entropía.
- **Alcanzabilidad:** con bloques de tamaño $n$ el exceso sobre $H$ es menor que $1/n$.
- **Fuentes más predecibles comprimen más:** con $P(1) = 0.05$, $H = 0.286$, y la compresión posible llega al 71 %.

:::figura[Fuente con P(1) = 0.05: la entropía es 0.286 bits y los bloques de 6 ya gastan 0.316 bits por símbolo, menos de un tercio del bit por símbolo inicial.]{componente="InformationViz"}
```yaml
modo: fuente
p: 0.05
bloque: 1
```
:::

- **Costo de un modelo equivocado:** si el código se diseña para $q$ y la fuente es $p$, la longitud por símbolo tiende a la entropía cruzada $H(p, q)$, que excede a $H(p)$ en $D_{\mathrm{KL}}(p \,\|\, q)$.
- **Fuentes con memoria:** para fuentes estacionarias el límite es la tasa de entropía $\lim_n H(X_1, \dots, X_n)/n$.

## Errores comunes

- **Pensar que aumentar el bloque siempre mejora.** La cota $H + 1/n$ baja, pero el valor de $L_n/n$ no es necesariamente monótono: con $P(1) = 0.2$ los bloques de 3 dan 0.728 bits por símbolo y los de 4, 0.741.

:::figura[Fuente con P(1) = 0.2: los puntos son 1, 0.78, 0.728, 0.741, 0.738 y 0.725, que suben y bajan sin salir nunca de la franja entre 0.722 y la cota punteada.]{componente="InformationViz"}
```yaml
modo: fuente
p: 0.2
bloque: 1
```
:::

- **Creer que se puede comprimir cualquier archivo.** El teorema habla de promedios bajo una distribución; un código que acorta algunos mensajes alarga otros, y datos ya comprimidos o aleatorios no se reducen.
- **Ignorar el costo de bloques grandes.** El número de bloques crece como $2^n$; en la práctica se usan métodos como la codificación aritmética, que se acercan a $H$ sin construir esa tabla.
- **Confundir compresión sin pérdida con compresión con pérdida.** El límite $H$ vale cuando los datos deben recuperarse exactamente; si se admite distorsión, el límite es otro.

## Conexiones

Da el significado operativo de la [[entropia-de-shannon]] y se demuestra con la [[codificacion-de-huffman]] aplicada a bloques. El costo de comprimir con un modelo equivocado es la [[entropia-cruzada]], y la [[longitud-minima-de-descripcion]] usa la misma idea, la longitud de código como medida, para elegir modelos.

## Formulario

:::formula[Cotas por bloques]
$$
H(X) \le \frac{L_n}{n} < H(X) + \frac{1}{n}
$$

- $H(X)$: entropía de un símbolo; $L_n$: longitud media del código de Huffman para bloques de $n$ símbolos; $n$: tamaño del bloque.
:::

:::formula[Longitud media de un bloque]
$$
L_n = \sum_{b} P(b)\,\ell(b)
$$

- $b$: bloque de $n$ símbolos; $P(b)$: su probabilidad, producto de las probabilidades de sus símbolos; $\ell(b)$: longitud de su palabra.
:::

:::formula[Límite de compresión]
$$
\lim_{n \to \infty} \frac{L_n}{n} = H(X)
$$

- La longitud por símbolo de los códigos óptimos por bloques tiende a la entropía.
:::
