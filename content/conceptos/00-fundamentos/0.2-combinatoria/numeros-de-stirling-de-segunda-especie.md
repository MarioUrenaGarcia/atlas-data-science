---
id: numeros-de-stirling-de-segunda-especie
titulo: Números de Stirling de segunda especie
titulo_en: Stirling numbers of the second kind
alias:
  - Stirling de segunda clase
  - S(n, k)
  - particiones en k bloques
modulo: 0
submodulo: '0.2'
orden: 18
nivel: intermedio
prerrequisitos:
  - particiones-de-un-conjunto
  - combinaciones
etiquetas:
  - particiones
  - recurrencias
  - funciones suprayectivas
  - conteo
resumen: >
  S(n, k) cuenta las maneras de partir un conjunto de n elementos en k bloques no vacíos sin orden. Cumple
  S(n, k) = S(n - 1, k - 1) + k S(n - 1, k), según el último elemento vaya solo o con otros.
formula: 'S(n, k) = S(n-1, k-1) + k\,S(n-1, k),\qquad S(n, k) = \frac{1}{k!}\sum_{j=0}^{k} (-1)^{j}\binom{k}{j}(k-j)^{n}'
visualizacion:
  componente: SetPartitionsViz
  parametros:
    modo: stirling
    n: 5
    k: 3
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una maestra divide a 5 estudiantes en 3 equipos de trabajo, sin nombres ni tamaños fijos, con la única condición de que ningún equipo quede vacío. ¿De cuántas maneras puede hacerlo? Los equipos no tienen etiqueta: lo que importa es quiénes quedan juntos.

Una forma de contar es fijarse en el último estudiante. O bien forma un equipo él solo, y los otros 4 se reparten en 2 equipos; o bien se une a alguno de los 3 equipos que formaron los otros 4. En el segundo caso hay 3 opciones para unirse a cada reparto de los 4 en 3 equipos. Así, $S(5, 3) = S(4, 2) + 3\,S(4, 3) = 7 + 3 \cdot 6 = 25$.

Estos números aparecen cada vez que objetos distintos se agrupan en grupos indistinguibles: tareas en procesadores idénticos, clientes en segmentos sin nombre, o funciones suprayectivas cuando se olvida el nombre de cada valor.

## Definición

:::definicion[Número de Stirling de segunda especie]
$S(n, k)$ es el número de particiones de un conjunto de $n$ elementos en exactamente $k$ bloques no vacíos. Por convención $S(0, 0) = 1$ y $S(n, 0) = 0$ para $n \ge 1$.
:::

:::teorema
Para $n, k \ge 1$,
$$
S(n, k) = S(n-1, k-1) + k\,S(n-1, k),
$$
y en forma explícita,
$$
S(n, k) = \frac{1}{k!}\sum_{j=0}^{k} (-1)^{j}\binom{k}{j}(k-j)^{n}.
$$
:::

:::demostracion
La recurrencia se obtiene separando las particiones según el bloque del elemento $n$: si está solo, al quitarlo queda una partición de los demás en $k - 1$ bloques; si no, al quitarlo queda una partición en $k$ bloques, y hay $k$ formas de reinsertarlo. La fórmula explícita cuenta con inclusión y exclusión las funciones suprayectivas de un conjunto de $n$ elementos en uno de $k$, que son $k!\,S(n, k)$ porque cada partición en $k$ bloques da $k!$ suprayecciones al asignar un valor distinto a cada bloque.
:::

:::nota[Qué significa cada símbolo]
- $n$: número de elementos distintos.
- $k$: número de bloques no vacíos, sin etiqueta.
- $S(n, k)$: número de Stirling de segunda especie.
- $j$: índice de la suma en la fórmula explícita (cuántos bloques se dejan vacíos).
- $k!$: formas de ponerle nombre a los $k$ bloques.
- $x(x-1)\cdots(x-k+1)$: factorial descendente de $x$.
:::

## Cómo usar la visualización

Los elementos están en un círculo y cada bloque de la partición actual se dibuja como una figura sombreada que une a sus miembros. La reproducción lista todas las particiones en $k$ bloques y las coloca en dos columnas: aquellas en que el último elemento está solo y aquellas en que comparte bloque. El panel muestra ambos conteos junto con la recurrencia.

Con $n = 5$ y $k = 3$, la primera columna llega a 7 y la segunda a 18, que es $3 \cdot 6$. Con $k = 1$ hay una sola partición y con $k = n$ también. Con $k = 2$ el total es $2^{n-1} - 1$: para $n = 5$, 15. La tabla de datos contiene los valores de $S(n, k)$ hasta $n = 7$.

## Ejemplo

Un centro de datos asigna 6 tareas distintas a 3 servidores idénticos, sin dejar ningún servidor sin trabajo.

1. Las asignaciones, sin distinguir servidores, son $S(6, 3)$.
2. Con la fórmula explícita: $\frac{1}{6}\left(3^6 - 3 \cdot 2^6 + 3 \cdot 1^6 - 0\right) = \frac{729 - 192 + 3}{6} = \frac{540}{6} = 90$.
3. Si los servidores tuvieran nombre, habría $3! \cdot 90 = 540$ asignaciones suprayectivas.
4. Comprobación con la recurrencia: $S(6, 3) = S(5, 2) + 3\,S(5, 3) = 15 + 3 \cdot 25 = 90$.

:::figura[Las 6 tareas del ejemplo repartidas en 3 servidores idénticos. Las 90 particiones se separan según si la tarea 6 va sola, $S(5, 2) = 15$, o comparte servidor, $3 \cdot S(5, 3) = 75$.]{componente="SetPartitionsViz"}
```yaml
modo: stirling
n: 6
k: 3
```
:::

## Propiedades

- **Casos simples:** $S(n, 1) = S(n, n) = 1$, $S(n, 2) = 2^{n-1} - 1$, $S(n, n-1) = \binom{n}{2}$.
- **Funciones suprayectivas:** el número de funciones suprayectivas de un conjunto de $n$ elementos en uno de $k$ es $k!\,S(n, k)$.
- **Potencias en factoriales descendentes:** $x^n = \sum_{k} S(n, k)\,x(x-1)\cdots(x-k+1)$.
- **Números de Bell:** $\sum_{k=0}^{n} S(n, k) = B_n$.
- **Momentos de la Poisson:** si $X$ tiene distribución de Poisson con media 1, $\mathbb{E}[X^n] = B_n$, y en general los momentos se escriben con $S(n, k)$.

## Errores comunes

- **Olvidar que los bloques no tienen etiqueta.** Si los grupos tienen nombre, hay que multiplicar por $k!$.
- **Permitir bloques vacíos.** $S(n, k)$ exige los $k$ bloques no vacíos; con bloques posiblemente vacíos y etiquetados habría $k^n$ asignaciones.
- **Confundirlos con los de primera especie.** Los números de Stirling de primera especie cuentan permutaciones con $k$ ciclos, no particiones.
- **Confundirlos con la aproximación de Stirling.** Llevan el mismo apellido, pero la aproximación de $n!$ es otro resultado.

## Conexiones

Los números de Stirling de segunda especie cuentan [[particiones-de-un-conjunto]] con un número fijo de bloques, y su fórmula explícita proviene del [[principio-de-inclusion-y-exclusion]]. Su suma sobre $k$ da los [[numeros-de-bell]]. La recurrencia es análoga a la regla de Pascal de las [[identidades-del-coeficiente-binomial]], con un factor $k$ que refleja la elección del bloque.

## Formulario

:::formula[Recurrencia]
$$
S(n, k) = S(n-1, k-1) + k\,S(n-1, k)
$$

- $S(n-1, k-1)$: el último elemento forma un bloque solo.
- $k\,S(n-1, k)$: el último elemento se une a uno de los $k$ bloques.
:::

:::formula[Fórmula explícita]
$$
S(n, k) = \frac{1}{k!}\sum_{j=0}^{k} (-1)^{j}\binom{k}{j}(k-j)^{n}
$$

- $(k - j)^n$: funciones de $n$ elementos en $k - j$ bloques con nombre.
- El $\frac{1}{k!}$ quita los nombres de los bloques.
:::

:::formula[Funciones suprayectivas]
$$
\#\{\text{suprayectivas de } n \text{ en } k\} = k!\,S(n, k)
$$

- $k!$: formas de asignar un valor distinto a cada bloque.
:::

:::formula[Casos particulares]
$$
S(n, 1) = S(n, n) = 1, \qquad S(n, 2) = 2^{n-1} - 1, \qquad S(n, n-1) = \binom{n}{2}
$$

- Se comprueban contando directamente.
:::
