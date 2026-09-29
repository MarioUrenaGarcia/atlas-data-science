---
id: numeros-de-bell
titulo: Números de Bell
titulo_en: Bell numbers
alias:
  - número de Bell
  - triángulo de Bell
  - número de particiones de un conjunto
modulo: 0
submodulo: '0.2'
orden: 19
nivel: intermedio
prerrequisitos:
  - numeros-de-stirling-de-segunda-especie
etiquetas:
  - particiones
  - relaciones de equivalencia
  - agrupamientos
  - conteo
resumen: >
  El número de Bell B(n) cuenta todas las particiones de un conjunto de n elementos, con cualquier número
  de bloques. Es la suma de S(n, k) sobre k y cumple B(n + 1) = suma de C(n, k) B(k).
formula: 'B_n = \sum_{k=0}^{n} S(n, k),\qquad B_{n+1} = \sum_{k=0}^{n} \binom{n}{k} B_k'
visualizacion:
  componente: SetPartitionsViz
  parametros:
    modo: bell
    n: 4
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Un algoritmo de agrupamiento recibe 4 clientes y debe decidir cuáles se parecen lo suficiente como para quedar en el mismo segmento, sin un número de segmentos fijado de antemano. Puede agruparlos todos juntos, dejarlos todos separados o cualquier opción intermedia. ¿Cuántas agrupaciones distintas existen? Son 15: una con un solo grupo, 7 con dos grupos, 6 con tres y una con cuatro.

Ese total es el número de Bell $B_4$. Cuenta todas las particiones de un conjunto, o equivalentemente todas las relaciones de equivalencia posibles sobre él. Crece muy rápido: con 10 clientes hay 115975 agrupaciones y con 20 hay más de 51 billones, lo que explica por qué un algoritmo de agrupamiento no puede revisar todas las opciones y necesita heurísticas.

## Definición

:::definicion[Número de Bell]
$B_n$ es el número de particiones de un conjunto de $n$ elementos en bloques no vacíos, con $B_0 = 1$.
:::

:::teorema
$$
B_n = \sum_{k=0}^{n} S(n, k), \qquad B_{n+1} = \sum_{k=0}^{n} \binom{n}{k} B_k.
$$
:::

:::demostracion
La primera igualdad separa las particiones por su número de bloques. Para la segunda, se fija el elemento $n + 1$: si su bloque contiene además a $j$ de los otros $n$ elementos, hay $\binom{n}{j}$ formas de elegirlos, y los $n - j$ restantes se parten de $B_{n-j}$ maneras. Sumando sobre $j$ y usando $\binom{n}{j} = \binom{n}{n-j}$ se obtiene la fórmula.
:::

## Cómo usar la visualización

La reproducción genera todas las particiones de $\{1, \dots, n\}$ colocando los elementos en orden: cada uno se une a un bloque existente o abre uno nuevo. La partición actual se dibuja en el círculo, con un color por bloque, y todas las generadas se listan abajo. El panel desglosa cuántas tienen 1, 2, 3, ... bloques.

Con $n = 4$ la lista llega a 15 y los conteos por número de bloques son 1, 7, 6 y 1, los números de Stirling de la fila 4. Al pasar a $n = 5$ el total salta a 52, y con $n = 6$ a 203. La tabla de datos muestra el triángulo de Bell, cuya primera columna son los números de Bell.

## Ejemplo

Se calcula $B_5$ de dos maneras.

1. **Por la recurrencia:** $B_5 = \binom{4}{0}B_0 + \binom{4}{1}B_1 + \binom{4}{2}B_2 + \binom{4}{3}B_3 + \binom{4}{4}B_4 = 1 + 4 + 12 + 20 + 15 = 52$, usando $B_0, \dots, B_4 = 1, 1, 2, 5, 15$.
2. **Por los números de Stirling:** $S(5, 1), \dots, S(5, 5) = 1, 15, 25, 10, 1$, que suman 52.
3. **Con el triángulo de Bell:** cada fila empieza con el último número de la anterior y cada entrada es la suma de su vecino izquierdo y el número que está encima de ese vecino. Las filas son 1; 1 2; 2 3 5; 5 7 10 15; 15 20 27 37 52. La primera entrada de cada fila es un número de Bell.

## Propiedades

- **Primeros valores:** $1, 1, 2, 5, 15, 52, 203, 877, 4140, 21147, 115975$.
- **Relaciones de equivalencia:** $B_n$ es el número de relaciones de equivalencia en un conjunto de $n$ elementos.
- **Fórmula de Dobinski:** $B_n = \frac{1}{e}\sum_{k=0}^{\infty} \frac{k^n}{k!}$, que interpreta $B_n$ como el momento de orden $n$ de una Poisson de media 1.
- **Función generadora exponencial:** $\sum_{n \ge 0} B_n \frac{x^n}{n!} = e^{e^x - 1}$.
- **Crecimiento:** $B_n$ crece más rápido que cualquier exponencial $c^n$, pero más lento que $n!$.

## Errores comunes

- **Contar particiones de un entero.** Las particiones de $\{1, 2, 3, 4\}$ son 15, mientras que las del número 4 son solo 5, porque en estas últimas los elementos no se distinguen.
- **Distinguir los bloques.** Si los grupos tuvieran nombre, el conteo sería diferente y más grande.
- **Olvidar la partición en un solo bloque o en bloques unitarios.** Ambas son particiones válidas y se cuentan.

## Conexiones

Los números de Bell suman los [[numeros-de-stirling-de-segunda-especie]] y cuentan todas las [[particiones-de-un-conjunto]], equivalentes a las [[relaciones-y-relaciones-de-equivalencia|relaciones de equivalencia]]. Su función generadora es un ejemplo de [[funciones-generadoras-exponenciales|función generadora exponencial]], y su contraste con las [[particiones-de-enteros]] muestra la diferencia entre objetos distinguibles e indistinguibles. En aprendizaje automático, el enorme número de particiones posibles justifica los métodos de agrupamiento aproximados.
