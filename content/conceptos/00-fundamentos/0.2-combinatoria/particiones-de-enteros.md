---
id: particiones-de-enteros
titulo: Particiones de enteros
titulo_en: Integer partitions
alias:
  - partición de un entero
  - diagramas de Ferrers
  - diagramas de Young
  - función de partición
modulo: 0
submodulo: '0.2'
orden: 21
nivel: intermedio
prerrequisitos:
  - combinaciones-con-repeticion
relaciones:
  - tipo: contrasta
    id: numeros-de-bell
etiquetas:
  - particiones
  - diagramas de Ferrers
  - conjugación
  - teoría de números
resumen: >
  Una partición de un entero positivo n es una forma de escribirlo como suma de enteros positivos sin
  importar el orden. Su número p(n) crece rápido y se estudia con diagramas de Ferrers y funciones generadoras.
formula: '\sum_{n \ge 0} p(n)\,x^n = \prod_{k \ge 1} \frac{1}{1 - x^{k}}'
visualizacion:
  componente: IntegerPartitionsViz
  parametros:
    vista: ferrers
    n: 6
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una tienda vende cajas de galletas y un cliente quiere 6 galletas repartidas en cajas, sin importar el orden en que se acomodan las cajas ni que las galletas sean distinguibles. Puede llevar una caja de 6, una de 5 y otra de 1, una de 4 y otra de 2, y así sucesivamente. Cada forma de repartir es una partición del número 6: $6$, $5 + 1$, $4 + 2$, $4 + 1 + 1$, $3 + 3$, $3 + 2 + 1$, $3 + 1 + 1 + 1$, $2 + 2 + 2$, $2 + 2 + 1 + 1$, $2 + 1 + 1 + 1 + 1$ y $1 + 1 + 1 + 1 + 1 + 1$. Hay 11.

A diferencia de las particiones de un conjunto, aquí los objetos que se agrupan son idénticos: solo importan los tamaños de los grupos. Y a diferencia de estrellas y barras, las cajas tampoco tienen nombre, así que $4 + 2$ y $2 + 4$ son lo mismo. Esa doble indistinguibilidad hace que no exista una fórmula cerrada sencilla para $p(n)$, pero sí herramientas muy elegantes: dibujos de puntos que revelan simetrías y una función generadora que codifica todos los valores a la vez.

## Definición

:::definicion[Partición de un entero]
Una **partición** de un entero $n \ge 1$ es una sucesión no creciente de enteros positivos $\lambda_1 \ge \lambda_2 \ge \dots \ge \lambda_r$ con $\lambda_1 + \dots + \lambda_r = n$. Los $\lambda_i$ son las **partes**. El número de particiones de $n$ se denota $p(n)$, con $p(0) = 1$.
:::

El **diagrama de Ferrers** de una partición tiene una fila de $\lambda_i$ puntos por cada parte, alineadas a la izquierda y de mayor a menor. Leer el diagrama por columnas da la **partición conjugada** $\lambda'$.

:::teorema[Función generadora]
$$
\sum_{n \ge 0} p(n)\,x^n = \prod_{k \ge 1} \frac{1}{1 - x^{k}} = \prod_{k \ge 1}\left(1 + x^k + x^{2k} + \cdots\right).
$$
:::

El factor $k$ registra cuántas partes iguales a $k$ se usan; el coeficiente de $x^n$ cuenta las formas de que las partes sumen $n$.

## Cómo usar la visualización

En la vista de diagramas de Ferrers, la reproducción lista las particiones del número elegido, de la que tiene la parte más grande a la de puras partes 1. Se dibujan el diagrama de la partición actual y el de su conjugada, que es el mismo diagrama reflejado respecto a su diagonal. La vista "Partes distintas y partes impares" lista en paralelo las particiones con partes todas distintas y las que tienen solo partes impares.

Con $n = 6$ la lista tiene 11 particiones; la partición $3 + 1 + 1 + 1$ tiene como conjugada $4 + 1 + 1$. En la segunda vista, las dos columnas terminan siempre con la misma longitud: con $n = 6$ hay 4 particiones en partes distintas y 4 en partes impares, y con $n = 10$ hay 10 de cada una.

## Ejemplo

Se cuentan las formas de pagar exactamente 8 pesos solo con monedas de 1, 2 y 5, sin importar el orden.

1. Con una moneda de 5: faltan 3 pesos con monedas de 1 y 2: $2 + 1$ o $1 + 1 + 1$, dos formas.
2. Sin monedas de 5: se paga 8 con monedas de 1 y 2; el número de monedas de 2 puede ser 0, 1, 2, 3 o 4, cinco formas.
3. En total, $2 + 5 = 7$ formas: son las particiones de 8 cuyas partes están en $\{1, 2, 5\}$.
4. Sin restringir las partes, $p(8) = 22$.

:::figura[Las formas de pagar 8 pesos con monedas de 1, 2 y 5 como coeficiente de una función generadora: al multiplicar los factores de cada moneda, la barra de 8 llega a 7.]{componente="GeneratingFunctionViz"}
```yaml
modo: ordinaria
partes: [1, 2, 5]
nombre: moneda
objetivo: 8
```
:::

## Propiedades

- **Primeros valores:** $p(1), \dots, p(10) = 1, 2, 3, 5, 7, 11, 15, 22, 30, 42$.
- **Conjugación:** el número de particiones de $n$ con a lo más $k$ partes es igual al de particiones de $n$ con partes de tamaño a lo más $k$.
- **Teorema de Euler:** el número de particiones de $n$ en partes distintas es igual al número de particiones en partes impares; en funciones generadoras, $\prod_k (1 + x^k) = \prod_k \frac{1}{1 - x^{2k-1}}$.
- **Crecimiento:** $p(n) \sim \frac{1}{4n\sqrt{3}}\exp\left(\pi\sqrt{2n/3}\right)$ (Hardy y Ramanujan).
- **Particiones con partes restringidas:** se obtienen quitando factores de la función generadora.

:::figura[El teorema de Euler con $n = 8$: las particiones en partes distintas y las particiones en partes impares se listan lado a lado y siempre hay la misma cantidad, 6 en este caso.]{componente="IntegerPartitionsViz"}
```yaml
vista: euler
n: 8
```
:::

## Errores comunes

- **Contar el orden.** $3 + 1$ y $1 + 3$ son la misma partición; las sumas ordenadas se llaman composiciones y hay $2^{n-1}$.
- **Confundirlas con particiones de conjuntos.** Las particiones de $\{1, 2, 3\}$ son 5, y las del número 3 son 3.
- **Olvidar la partición trivial.** El propio $n$ es una partición de sí mismo, con una sola parte.

## Conexiones

Las particiones de enteros son repartos de objetos idénticos en grupos sin etiqueta, a diferencia de las [[combinaciones-con-repeticion]] (grupos etiquetados) y de los [[numeros-de-bell]] (objetos distintos). Su función generadora es el ejemplo central de las [[funciones-generadoras-ordinarias]], construida con factores de [[serie-geometrica|series geométricas]]. En física estadística y en la teoría de representaciones de grupos simétricos, las particiones clasifican estados y representaciones.
