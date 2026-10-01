---
id: independencia-por-pares-vs-independencia-mutua
titulo: Independencia por pares vs independencia mutua
titulo_en: Pairwise versus mutual independence
alias:
  - independencia conjunta
  - independencia dos a dos
  - independencia completa
modulo: 1
submodulo: '1.2'
orden: 10
nivel: basico
prerrequisitos:
  - independencia-de-eventos
etiquetas:
  - independencia
  - tres eventos
  - contraejemplo
  - factorización
resumen: >
  Varios eventos pueden ser independientes de dos en dos sin ser mutuamente independientes: la
  independencia mutua exige que el producto valga para toda subcolección, incluida la de todos los eventos.
formula: 'P\Big(\bigcap_{i \in S} A_i\Big) = \prod_{i \in S} P(A_i) \quad \text{para todo } S \subseteq \{1, \dots, n\}'
visualizacion:
  componente: ProbabilityTree
  parametros:
    niveles: [Moneda 1, Moneda 2]
    contexto: 'Se lanzan dos monedas. A: la primera cae cara; B: la segunda cae cara; C: las dos coinciden (hojas C/C y X/X).'
    ramas:
      - etiqueta: C
        prob: 0.5
        ramas:
          - etiqueta: C
            prob: 0.5
          - etiqueta: X
            prob: 0.5
      - etiqueta: X
        prob: 0.5
        ramas:
          - etiqueta: C
            prob: 0.5
          - etiqueta: X
            prob: 0.5
    consultas:
      - nombre: C (coinciden)
        hojas: [C/C, X/X]
      - nombre: C dado A
        hojas: [C/C]
        condicion: [C/C, C/X]
      - nombre: C dado B
        hojas: [C/C]
        condicion: [C/C, X/C]
      - nombre: C dado A y B
        hojas: [C/C]
        condicion: [C/C]
referencias:
  - clave: blitzstein-hwang
    capitulo: '2.5'
  - clave: ross-probabilidad
    capitulo: '3.4'
publicado: true
---

## Intuición

Se lanzan dos monedas. Sean A = "la primera cae cara", B = "la segunda cae cara" y C = "las dos monedas coinciden". Cada par de estos eventos es independiente: saber que la primera cayó cara no dice nada sobre si coinciden (eso depende de la segunda), y lo mismo con la segunda. Pero saber A y B a la vez determina C por completo: si ambas cayeron cara, coinciden con certeza.

Este ejemplo muestra que la independencia de dos en dos no basta para decir que un grupo de eventos es independiente. La **independencia mutua** exige que ninguna combinación de los eventos dé información sobre los demás, lo que equivale a que la probabilidad de cualquier intersección sea el producto de las probabilidades. La **independencia por pares** solo lo exige para las intersecciones de dos.

La distinción importa en la práctica: varios indicadores que no se correlacionan de dos en dos pueden, combinados, predecir perfectamente otro, como ocurre con un bit de paridad en la transmisión de datos.

## Definición

:::definicion[Independencia por pares]
Los eventos $A_1, \dots, A_n$ son **independientes por pares** si $P(A_i \cap A_j) = P(A_i)\,P(A_j)$ para todo $i \neq j$.
:::

:::definicion[Independencia mutua]
Los eventos $A_1, \dots, A_n$ son **mutuamente independientes** si para toda subcolección de índices $S \subseteq \{1, \dots, n\}$ con al menos dos elementos,
$$
P\Big(\bigcap_{i \in S} A_i\Big) = \prod_{i \in S} P(A_i).
$$
:::

Para tres eventos, la independencia mutua exige las tres igualdades de pares y además $P(A \cap B \cap C) = P(A)\,P(B)\,P(C)$. Son $2^n - n - 1$ condiciones en total.

:::figura[El primer par del ejemplo con la rejilla de dos monedas: dentro de "la primera cae cara", la mitad de los resultados coinciden, igual que en todo el espacio. A y C son independientes.]{componente="SampleSpaceLab"}
```yaml
modo: condicional
experimento: dos-monedas
eventoA: todas-iguales
eventoB: primera-cara
eventos: [todas-iguales, primera-cara, segunda-cara]
```
:::

:::nota[Qué significa cada símbolo]
- $A_1, \dots, A_n$: eventos; $n$ es cuántos son.
- $S$: subcolección de índices; $\bigcap_{i \in S} A_i$: ocurren todos los eventos de $S$.
- $\prod_{i \in S} P(A_i)$: producto de sus probabilidades.
- $2^n - n - 1$: número de subcolecciones con al menos dos eventos.
- En el ejemplo, $A$, $B$, $C$: primera cara, segunda cara y coincidencia.
:::

## Cómo usar la visualización

El árbol representa las dos monedas: cuatro hojas de probabilidad 1/4. El evento C, "las monedas coinciden", son las hojas C/C y X/X. El selector "Qué se calcula" recorre cuatro consultas: $P(C) = 1/2$, $P(C \mid A) = 1/2$, $P(C \mid B) = 1/2$ y $P(C \mid A \cap B) = 1$.

Las tres primeras muestran independencia por pares: condicionar en un solo evento no cambia la probabilidad de C. La última muestra que no hay independencia mutua: condicionar en A y B a la vez lleva la probabilidad de C a 1. Equivalentemente, $P(A \cap B \cap C) = 1/4$, mientras que $P(A)\,P(B)\,P(C) = 1/8$.

## Ejemplo

Se lanzan dos dados. Sean $A$ = "el primer dado es impar", $B$ = "el segundo dado es impar" y $C$ = "la suma es impar".

1. $P(A) = P(B) = P(C) = 1/2$.
2. $P(A \cap B) = 9/36 = 1/4 = P(A)\,P(B)$.
3. $A \cap C$: primer dado impar y suma impar, es decir, segundo dado par: $9/36 = 1/4 = P(A)\,P(C)$. Igual para $B \cap C$.
4. $A \cap B \cap C$: ambos impares y suma impar es imposible, porque impar más impar es par: $P(A \cap B \cap C) = 0 \neq 1/8$.

Los tres eventos son independientes por pares, pero no mutuamente independientes: saber $A$ y $B$ hace imposible $C$.

:::figura[El ejemplo de los dados en un árbol por paridades: cada dado es impar con probabilidad 1/2. La consulta "C dado A y B" vale 0, aunque C dado A y C dado B valen 1/2.]{componente="ProbabilityTree"}
```yaml
niveles: [Dado 1, Dado 2]
ramas:
  - etiqueta: Impar
    prob: 0.5
    ramas:
      - etiqueta: Impar
        prob: 0.5
      - etiqueta: Par
        prob: 0.5
  - etiqueta: Par
    prob: 0.5
    ramas:
      - etiqueta: Impar
        prob: 0.5
      - etiqueta: Par
        prob: 0.5
consultas:
  - nombre: Suma impar
    hojas: [Impar/Par, Par/Impar]
  - nombre: Suma impar dado primero impar
    hojas: [Impar/Par]
    condicion: [Impar/Impar, Impar/Par]
  - nombre: Suma impar dado ambos impares
    hojas: [Impar/Par]
    condicion: [Impar/Impar]
```
:::

## Propiedades

- **Mutua implica por pares:** la independencia mutua incluye las condiciones de pares, pero no al revés.
- **Complementos:** si $A_1, \dots, A_n$ son mutuamente independientes, también lo es cualquier colección que se obtenga reemplazando algunos $A_i$ por sus complementos.
- **Funciones de grupos disjuntos:** con independencia mutua, eventos construidos con grupos disjuntos de los $A_i$ son independientes; por ejemplo, $A_1 \cup A_2$ es independiente de $A_3$.
- **El producto triple no basta:** $P(A \cap B \cap C) = P(A)P(B)P(C)$ tampoco implica independencia por pares; hay que verificar todas las condiciones.
- **Experimentos repetidos:** los resultados de repeticiones independientes de un experimento son mutuamente independientes, que es lo que justifica multiplicar probabilidades en lanzamientos sucesivos.

:::figura[Mutuamente independientes: tres monedas distintas. Cada combinación de caras tiene probabilidad 1/8, el producto de las tres probabilidades, y ninguna combinación de dos monedas informa sobre la tercera.]{componente="SampleSpaceLab"}
```yaml
modo: eventos
experimento: tres-monedas
eventoA: todas-iguales
eventos: [todas-iguales, primera-cara, exactamente-dos-caras]
operaciones: [A]
```
:::

## Errores comunes

- **Verificar solo pares.** Revisar que cada par de eventos sea independiente no garantiza que se puedan multiplicar las probabilidades de tres o más.
- **Verificar solo el producto completo.** La igualdad $P(A \cap B \cap C) = P(A)P(B)P(C)$ sin las condiciones de pares tampoco es suficiente.
- **Llamar "independientes" a variables que solo no están correlacionadas de dos en dos.** En análisis de datos, la ausencia de correlación por pares es aún más débil que la independencia por pares.

:::figura[La condición de pares sí se cumple para B y C: dentro de "la segunda cae cara", la mitad coincide. Por eso el contraejemplo engaña si solo se revisan pares.]{componente="SampleSpaceLab"}
```yaml
modo: condicional
experimento: dos-monedas
eventoA: todas-iguales
eventoB: segunda-cara
eventos: [todas-iguales, segunda-cara]
```
:::

## Conexiones

La distinción refina la [[independencia-de-eventos]] para colecciones de tres o más eventos. El ejemplo de la paridad reaparece en teoría de la información y en criptografía, donde un bit de control es independiente de cada bit por separado pero está determinado por todos juntos. La [[independencia-condicional]] es otra variante que no se deduce de la independencia simple ni la implica, y la independencia mutua de variables aleatorias es la hipótesis de las muestras aleatorias en estadística.

## Formulario

:::formula[Independencia por pares]
$$
P(A_i \cap A_j) = P(A_i)\,P(A_j), \qquad i \neq j
$$

- Solo se exige para intersecciones de dos eventos.
:::

:::formula[Independencia mutua]
$$
P\Big(\bigcap_{i \in S} A_i\Big) = \prod_{i \in S} P(A_i), \qquad S \subseteq \{1, \dots, n\}, \ |S| \ge 2
$$

- $|S|$: número de eventos de la subcolección.
:::

:::formula[Tres eventos]
$$
P(A \cap B \cap C) = P(A)\,P(B)\,P(C)
$$

- Condición adicional a las tres de pares; en el ejemplo de las monedas falla: $1/4 \neq 1/8$.
:::

:::formula[Número de condiciones]
$$
\binom{n}{2} + \binom{n}{3} + \cdots + \binom{n}{n} = 2^n - n - 1
$$

- $\binom{n}{k}$: número de subcolecciones de $k$ eventos.
:::
