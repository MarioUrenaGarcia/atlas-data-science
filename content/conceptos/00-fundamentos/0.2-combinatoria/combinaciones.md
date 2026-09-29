---
id: combinaciones
titulo: Combinaciones
titulo_en: Combinations
alias:
  - combinaciones sin repetición
  - subconjuntos de tamaño k
  - n en k
modulo: 0
submodulo: '0.2'
orden: 8
nivel: basico
prerrequisitos:
  - variaciones
relaciones:
  - tipo: relacionado
    id: conjunto-potencia
etiquetas:
  - conteo
  - subconjuntos
  - selección sin orden
  - comités
resumen: >
  Una combinación es una selección de k objetos de un conjunto de n en la que el orden no importa. Hay
  n!/(k!(n - k)!) combinaciones: las selecciones ordenadas divididas entre los k! órdenes de cada grupo.
formula: '\binom{n}{k} = \frac{n!}{k!\,(n-k)!} = \frac{V(n, k)}{k!}'
visualizacion:
  componente: CombinatoricsBoard
  parametros:
    modo: combinaciones
    objetos: [Ana, Beto, Caro, Dani, Eli]
    k: 3
referencias:
  - clave: ross-probabilidad
    capitulo: '1'
publicado: true
---

## Intuición

Un grupo de cinco estudiantes debe elegir una comisión de tres personas para organizar la graduación, sin cargos ni jerarquías. Si se eligiera primero a una persona, luego a otra y luego a otra, habría $5 \cdot 4 \cdot 3 = 60$ selecciones ordenadas. Pero la comisión formada por Ana, Beto y Caro es la misma sin importar en qué orden se haya nombrado a cada uno.

Cada comisión aparece entre las 60 selecciones ordenadas exactamente $3! = 6$ veces, una por cada forma de ordenar a sus tres integrantes. Por lo tanto, el número de comisiones distintas es $60 / 6 = 10$. La idea de las combinaciones es esta: contar como si el orden importara y después dividir entre el número de órdenes de cada grupo.

Una combinación es, en el fondo, un subconjunto: la pregunta "¿de cuántas maneras se eligen 3 de 5?" es la pregunta "¿cuántos subconjuntos de tamaño 3 tiene un conjunto de 5 elementos?".

## Definición

:::definicion[Combinación]
Una **combinación** de $k$ elementos tomados de un conjunto $A$ con $n$ elementos es un subconjunto de $A$ con exactamente $k$ elementos.
:::

:::teorema
Para $0 \le k \le n$, el número de combinaciones es
$$
\binom{n}{k} = \frac{n!}{k!\,(n-k)!}.
$$
:::

:::demostracion
Una selección ordenada de $k$ elementos distintos se construye eligiendo primero el subconjunto y después uno de sus $k!$ órdenes. Por el principio del producto, $V(n, k) = \binom{n}{k}\, k!$, de donde $\binom{n}{k} = \frac{V(n, k)}{k!} = \frac{n!}{k!(n-k)!}$.
:::

## Cómo usar la visualización

Cada tarjeta es un grupo de $k$ personas. La reproducción recorre todas las selecciones ordenadas y deposita cada una en la tarjeta de su grupo, escribiendo el orden en que se eligió. El medidor de cada tarjeta tiene $k!$ celdas. El panel compara el número de selecciones ordenadas, el número de órdenes por grupo y el número de grupos.

Con $n = 5$ y $k = 3$, las 60 selecciones llenan exactamente 10 tarjetas de 6 celdas. Con $k = 1$ cada tarjeta tiene una sola celda y no hay nada que dividir. Con $k = 4$ hay 5 grupos, tantos como con $k = 1$: elegir quién entra equivale a elegir quién se queda fuera.

## Ejemplo

En una lotería se eligen 6 números distintos del 1 al 45, y el orden de extracción no importa.

1. El número de boletos posibles es $\binom{45}{6} = \frac{45 \cdot 44 \cdot 43 \cdot 42 \cdot 41 \cdot 40}{6!} = \frac{5864443200}{720} = 8145060$.
2. Un boleto gana el premio mayor con probabilidad $1/8145060 \approx 1.23 \times 10^{-7}$.
3. Para acertar exactamente 5 números se eligen 5 de los 6 ganadores y 1 de los 39 no ganadores: $\binom{6}{5}\binom{39}{1} = 6 \cdot 39 = 234$ boletos.

## Propiedades

- **Simetría:** $\binom{n}{k} = \binom{n}{n-k}$.
- **Casos extremos:** $\binom{n}{0} = \binom{n}{n} = 1$ y $\binom{n}{1} = n$.
- **Suma de todos los tamaños:** $\sum_{k=0}^{n} \binom{n}{k} = 2^n$, el número total de subconjuntos.
- **Cálculo práctico:** $\binom{n}{k} = \frac{n(n-1)\cdots(n-k+1)}{k!}$, que evita calcular factoriales enormes.
- **Selección en dos grupos:** elegir $a$ de un grupo de $m$ y $b$ de otro de $p$ da $\binom{m}{a}\binom{p}{b}$ maneras.

## Errores comunes

- **Usar combinaciones cuando el orden importa.** Un podio con oro, plata y bronce requiere variaciones.
- **Olvidar dividir entre $k!$.** Contar comisiones como $5 \cdot 4 \cdot 3$ cuenta cada comisión seis veces.
- **Contar dos veces al elegir en etapas sin orden.** "Elegir un hombre y luego otro" para una pareja de hombres produce cada pareja dos veces; hay que dividir o usar $\binom{m}{2}$ directamente.

## Conexiones

Las combinaciones son las [[variaciones]] sin orden y cuentan los subconjuntos de tamaño fijo del [[conjunto-potencia]]. Su número es el [[coeficiente-binomial]], que satisface identidades notables y forma el triángulo de Pascal. Si los objetos pueden repetirse, se obtienen las [[combinaciones-con-repeticion]]. En probabilidad, las combinaciones cuentan muestras sin reemplazo y dan lugar a las distribuciones binomial e hipergeométrica.
