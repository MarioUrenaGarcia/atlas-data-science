---
id: concepto-beta
titulo: Concepto beta
titulo_en: Beta concept
modulo: 0
submodulo: '0.1'
orden: 2
nivel: basico
prerrequisitos: [concepto-alfa]
etiquetas: [conteo, suma]
resumen: Concepto intermedio de prueba.
visualizacion:
  componente: FixtureViz
referencias:
  - clave: ross-probabilidad
publicado: true
---

## Intuición

Imaginemos una biblioteca en la que cada libro tiene una etiqueta de color. Si queremos saber cuántos libros son rojos, basta con recorrer los estantes y contar las etiquetas rojas. Esta ficha de prueba describe una situación parecida: un conjunto de objetos, una propiedad que algunos cumplen y un conteo que resume cuántos la cumplen. La idea es que el lector vea primero el fenómeno concreto y después la definición, de modo que la notación llegue cuando ya existe una imagen mental clara. El conteo no depende del orden en que se revisan los libros ni de quién lo realiza.

## Definición

Sea $A$ un conjunto finito y sea $p$ una propiedad. El conteo es

$$
N = \sum_{a \in A} \mathbf{1}\{p(a)\}.
$$

:::definicion
Un conteo es una suma de indicadoras.
:::

## Cómo usar la visualización

La visualización muestra los objetos del conjunto como puntos y colorea los que cumplen la propiedad. El control de tamaño cambia cuántos objetos hay y el control de proporción cambia qué fracción cumple la propiedad. Al aumentar el tamaño, la proporción observada se acerca a la proporción elegida. Al cambiar la semilla, el conteo varía, pero su promedio se mantiene estable.

## Ejemplo

Con 10 libros de los cuales 3 son rojos, el conteo es $N = 3$.

## Propiedades

El conteo es aditivo sobre conjuntos disjuntos.

:::demostracion
Si $A$ y $B$ son disjuntos, cada elemento aparece en una sola suma.
:::

## Errores comunes

Contar dos veces un mismo objeto cuando los conjuntos se traslapan.

## Conexiones

Depende de [[concepto-alfa|el concepto alfa]].

## Formulario

:::formula[Conteo de un conjunto]

$$
N = |A|
$$

- $N$: número de elementos contados.
- $A$: conjunto cuyos elementos se cuentan.
- $|A|$: cardinalidad de $A$.
  :::
