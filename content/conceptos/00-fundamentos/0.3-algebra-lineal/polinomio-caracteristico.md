---
id: polinomio-caracteristico
titulo: Polinomio característico
titulo_en: Characteristic polynomial
alias:
  - ecuación característica
  - det(A - lambda I)
modulo: 0
submodulo: '0.3'
orden: 29
nivel: basico
prerrequisitos:
  - valores-y-vectores-propios
etiquetas:
  - polinomio característico
  - valores propios
  - determinante
  - raíces
resumen: >
  El polinomio característico p(lambda) = det(A - lambda I) tiene como raíces los valores propios de A;
  para matrices de 2 por 2 es λ^2 - (tr A) λ + det A.
formula: 'p(\lambda) = \det(A - \lambda I), \qquad n = 2:\ p(\lambda) = \lambda^2 - (\operatorname{tr}A)\,\lambda + \det A'
visualizacion:
  componente: MatrixTransform
  parametros:
    modo: caracteristico
    matrices:
      - nombre: Dos raíces reales
        matriz: [[1, 2], [3, 2]]
      - nombre: Raíz doble
        matriz: [[2, 1], [0, 2]]
      - nombre: Raíces complejas
        matriz: [[1, -2], [1, 3]]
referencias:
  - clave: strang
publicado: true
---

## Intuición

Los valores propios son los números $\lambda$ para los que la matriz $A - \lambda I$ aplasta alguna dirección hasta cero. Una matriz aplasta el plano exactamente cuando su determinante, el factor de área, vale cero. Entonces basta seguir el área que $A - \lambda I$ le da al cuadrado unitario mientras $\lambda$ recorre la recta numérica, y anotar dónde esa área se anula.

Esa área, como función de $\lambda$, es un polinomio: el polinomio característico. Para una matriz de $2 \times 2$ es una parábola que abre hacia arriba, y cada vez que cruza el eje horizontal marca un valor propio. Si la parábola corta el eje dos veces hay dos valores propios reales; si lo toca en un solo punto hay uno repetido; y si queda por encima del eje los valores propios son complejos y no hay direcciones reales que se conserven.

## Definición

:::definicion[Polinomio característico]
Para $A \in \mathbb{R}^{n \times n}$, el **polinomio característico** es
$$
p_A(\lambda) = \det(A - \lambda I),
$$
un polinomio de grado $n$ en $\lambda$. Los valores propios de $A$ son exactamente sus raíces, y la **multiplicidad algebraica** de un valor propio es su multiplicidad como raíz.
:::

:::teorema[Caso de 2 por 2]
Para $A = \begin{pmatrix} a & b \\ c & d \end{pmatrix}$,
$$
p_A(\lambda) = \lambda^2 - (a + d)\,\lambda + (ad - bc) = \lambda^2 - (\operatorname{tr}A)\,\lambda + \det A,
$$
y los valores propios son $\lambda = \tfrac{1}{2}\big(\operatorname{tr}A \pm \sqrt{(\operatorname{tr}A)^2 - 4\det A}\big)$.
:::

:::nota[Qué significa cada símbolo]
- $A$: matriz cuadrada de $n \times n$.
- $\lambda$: variable del polinomio; sus raíces son los valores propios.
- $I$: identidad.
- $p_A(\lambda)$: polinomio característico de $A$.
- $a, b, c, d$: entradas de una matriz de $2 \times 2$.
- $\operatorname{tr}A$: traza, suma de la diagonal.
- $\det A$: determinante.
- $(\operatorname{tr}A)^2 - 4\det A$: discriminante; su signo decide si las raíces son reales.
:::

## Cómo usar la visualización

$\lambda$ recorre la recta real. A la izquierda se dibuja $p(\lambda) = \det(A - \lambda I)$ con el punto actual; a la derecha, la rejilla deformada por $B = A - \lambda I$ con su cuadrado de área $p(\lambda)$. El selector cambia de matriz y el panel muestra traza, determinante, discriminante y raíces.

Cuando $\lambda$ pasa por una raíz, la rejilla de la derecha se aplasta sobre una recta: $B$ es singular y la dirección aplastada es un vector propio. Con raíces complejas la parábola nunca toca el eje y la rejilla nunca se aplasta. Con la raíz doble, la parábola apenas toca el eje en $\lambda = 2$.

## Ejemplo

La matriz $A = \begin{pmatrix} 4 & 1 \\ 2 & 3 \end{pmatrix}$ describe cómo se reparten dos tipos de clientes entre un mes y el siguiente en un modelo simplificado.

1. $\operatorname{tr}A = 7$ y $\det A = 12 - 2 = 10$.
2. $p(\lambda) = \lambda^2 - 7\lambda + 10 = (\lambda - 5)(\lambda - 2)$: valores propios 5 y 2.
3. Para $\lambda = 5$: $A - 5I = \begin{pmatrix} -1 & 1 \\ 2 & -2 \end{pmatrix}$, cuyo espacio nulo es $\operatorname{gen}\{(1, 1)\}$.
4. Para $\lambda = 2$: $A - 2I = \begin{pmatrix} 2 & 1 \\ 2 & 1 \end{pmatrix}$, cuyo espacio nulo es $\operatorname{gen}\{(1, -2)\}$.
5. Comprobación: $5 + 2 = 7 = \operatorname{tr}A$ y $5 \cdot 2 = 10 = \det A$.

:::figura[La matriz del ejemplo: la parábola λ² - 7λ + 10 corta el eje en 2 y en 5, y en esos valores A - λI aplasta el plano.]{componente="MatrixTransform"}
```yaml
modo: caracteristico
matrices:
  - nombre: Clientes
    matriz: [[4, 1], [2, 3]]
```
:::

## Propiedades

- **Coeficientes:** $p_A(\lambda) = (-1)^n\big(\lambda^n - (\operatorname{tr}A)\lambda^{n-1} + \dots + (-1)^n\det A\big)$; el término constante es $\det A$ y el de grado $n - 1$ involucra la traza.
- **Invariancia:** matrices semejantes tienen el mismo polinomio característico.
- **Raíces complejas conjugadas:** si $A$ es real, las raíces complejas aparecen en pares $\alpha \pm \beta i$.
- **Triangulares:** $p_A(\lambda) = \prod_i (a_{ii} - \lambda)$.
- **Teorema de Cayley-Hamilton:** toda matriz anula su polinomio característico, $p_A(A) = 0$.
- **Multiplicidades:** la multiplicidad geométrica de un valor propio, $\dim N(A - \lambda I)$, está entre 1 y la algebraica.

:::figura[Casos del discriminante: positivo da dos valores propios reales distintos, cero da uno repetido y negativo da un par complejo.]{componente="MatrixTransform"}
```yaml
modo: caracteristico
matrices:
  - nombre: Discriminante negativo
    matriz: [[1, -2], [1, 3]]
  - nombre: Discriminante cero
    matriz: [[3, 1], [-1, 1]]
  - nombre: Discriminante positivo
    matriz: [[1, 3], [1, -1]]
```
:::

:::demostracion
Caso de $2 \times 2$: $\det\begin{pmatrix} a - \lambda & b \\ c & d - \lambda \end{pmatrix} = (a - \lambda)(d - \lambda) - bc = \lambda^2 - (a + d)\lambda + (ad - bc)$.
:::

## Errores comunes

- **Restar $\lambda$ a todas las entradas.** Solo se resta en la diagonal: $A - \lambda I$.
- **Buscar raíces del polinomio para matrices grandes.** Para $n \ge 5$ no hay fórmula general y las raíces de un polinomio son sensibles a errores; en la práctica se usan métodos iterativos como QR.
- **Olvidar las raíces complejas.** Un polinomio sin raíces reales no significa que la matriz no tenga valores propios.
- **Confundir multiplicidad algebraica con número de vectores propios independientes.** La cizalla tiene $\lambda = 1$ doble y una sola dirección propia.

## Conexiones

El polinomio característico traduce la búsqueda de [[valores-y-vectores-propios]] a encontrar raíces, usando el [[determinante-como-factor-de-volumen|determinante]] de $A - \lambda I$. Sus multiplicidades deciden si hay [[diagonalizacion]], y su término constante y su coeficiente de $\lambda^{n-1}$ se relacionan con la [[traza-de-una-matriz|traza]]. En series temporales, la estabilidad de un modelo autorregresivo depende de las raíces de un polinomio característico.

## Formulario

:::formula[Polinomio característico]
$$
p_A(\lambda) = \det(A - \lambda I)
$$

- $A$: matriz cuadrada.
- $\lambda$: variable; las raíces son los valores propios.
:::

:::formula[Caso de 2 por 2]
$$
p_A(\lambda) = \lambda^2 - (\operatorname{tr}A)\,\lambda + \det A
$$

- $\operatorname{tr}A = a + d$.
- $\det A = ad - bc$.
:::

:::formula[Valores propios de 2 por 2]
$$
\lambda_{1,2} = \frac{\operatorname{tr}A \pm \sqrt{(\operatorname{tr}A)^2 - 4\det A}}{2}
$$

- El discriminante $(\operatorname{tr}A)^2 - 4\det A$ decide si las raíces son reales, repetidas o complejas.
:::

:::formula[Cayley-Hamilton]
$$
p_A(A) = 0
$$

- $p_A(A)$: el polinomio evaluado en la propia matriz, con $\lambda^k$ sustituido por $A^k$.
:::
