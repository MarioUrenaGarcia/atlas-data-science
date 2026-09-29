---
id: combinaciones-con-repeticion
titulo: Combinaciones con repetición (estrellas y barras)
titulo_en: Combinations with repetition (stars and bars)
alias:
  - estrellas y barras
  - multiconjuntos
  - multicombinaciones
modulo: 0
submodulo: '0.2'
orden: 9
nivel: basico
prerrequisitos:
  - combinaciones
etiquetas:
  - conteo
  - multiconjuntos
  - estrellas y barras
  - repartos
resumen: >
  Elegir k objetos de n tipos cuando el orden no importa y los tipos pueden repetirse equivale a acomodar
  k estrellas y n - 1 barras en fila, lo que da C(n + k - 1, k) selecciones.
formula: '\left(\!\binom{n}{k}\!\right) = \binom{n + k - 1}{k} = \binom{n + k - 1}{n - 1}'
visualizacion:
  componente: CombinatoricsBoard
  parametros:
    modo: estrellas-y-barras
    tipos: [fresa, limón, mango, coco]
    k: 4
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una paletería ofrece cuatro sabores y se compran cuatro paletas. Solo importa cuántas paletas hay de cada sabor, no en qué orden se sirvieron: dos de fresa, una de mango y una de coco es una compra. ¿Cuántas compras distintas hay?

Un truco convierte el problema en uno que ya se sabe resolver. Se dibujan las paletas como estrellas en fila, primero las de fresa, luego las de limón, luego las de mango y al final las de coco, y se ponen barras para separar los sabores. La compra anterior queda así: `**||*|*`. Cuatro estrellas y tres barras (una menos que el número de sabores). Cada compra da una fila distinta y cada fila con 4 estrellas y 3 barras corresponde a una compra. Contar compras es, entonces, contar en qué lugares de los 7 símbolos van las 3 barras: $\binom{7}{3} = 35$.

## Definición

Un **multiconjunto** de tamaño $k$ sobre un conjunto de $n$ tipos es una colección de $k$ elementos de esos tipos en la que los tipos pueden repetirse y el orden no importa. Equivalentemente, es una solución de
$$
x_1 + x_2 + \dots + x_n = k, \qquad x_i \in \{0, 1, 2, \dots\},
$$
donde $x_i$ es el número de elementos del tipo $i$.

:::teorema[Estrellas y barras]
El número de multiconjuntos de tamaño $k$ sobre $n$ tipos, o de soluciones enteras no negativas de $x_1 + \dots + x_n = k$, es
$$
\binom{n + k - 1}{k} = \binom{n + k - 1}{n - 1}.
$$
:::

:::demostracion
A cada solución se le asocia la fila con $x_1$ estrellas, una barra, $x_2$ estrellas, una barra, y así hasta $x_n$ estrellas. La fila tiene $k$ estrellas y $n - 1$ barras, y la correspondencia es biyectiva: de cualquier fila así se leen los $x_i$ contando las estrellas entre barras. Hay $\binom{n + k - 1}{n - 1}$ formas de elegir las posiciones de las barras.
:::

## Cómo usar la visualización

Arriba se dibuja la compra actual como estrellas de colores separadas por barras, con el número de paletas de cada sabor debajo. La reproducción lista todas las compras en su forma de estrellas y barras. Los controles cambian el número de sabores y de paletas.

Con 4 sabores y 4 paletas hay 35 compras. Con 2 sabores, la fila tiene una sola barra y las compras son $k + 1$, una por cada lugar posible de la barra. Si se pide que haya al menos una paleta de cada sabor, basta dar una de cada una por adelantado y repartir las restantes, lo que se ve fijando $k$ en 0 con 4 sabores: queda una sola compra.

## Ejemplo

Una fundación reparte 10 becas idénticas entre 3 escuelas.

1. **Sin restricciones:** se buscan soluciones de $x_1 + x_2 + x_3 = 10$ con $x_i \ge 0$: $\binom{12}{2} = 66$ repartos.
2. **Al menos una beca por escuela:** se asigna una a cada escuela y se reparten las 7 restantes libremente: $\binom{9}{2} = 36$ repartos.
3. **Al menos dos becas a la primera escuela:** se asignan 2 a la primera y se reparten 8 libremente: $\binom{10}{2} = 45$ repartos.

:::figura[Las 10 becas del ejemplo repartidas entre 3 escuelas: cada reparto es una fila de 10 estrellas separadas por 2 barras, y hay $\binom{12}{2} = 66$.]{componente="CombinatoricsBoard"}
```yaml
modo: estrellas-y-barras
tipos: [Escuela 1, Escuela 2, Escuela 3]
k: 10
```
:::

## Propiedades

- **Soluciones positivas:** el número de soluciones de $x_1 + \dots + x_n = k$ con $x_i \ge 1$ es $\binom{k - 1}{n - 1}$.
- **Relación con combinaciones:** $\binom{n + k - 1}{k}$ es el número de subconjuntos de tamaño $k$ de un conjunto de $n + k - 1$ elementos.
- **Monomios:** el número de monomios de grado $k$ en $n$ variables es $\binom{n + k - 1}{k}$.
- **Desigualdades:** las soluciones de $x_1 + \dots + x_n \le k$ se cuentan agregando una variable de holgura: $\binom{n + k}{n}$.

## Errores comunes

- **Usar $n^k$.** Eso cuenta sucesiones ordenadas; en un multiconjunto el orden no importa.
- **Usar $\binom{n}{k}$.** Eso prohíbe repetir tipos; aquí pueden repetirse.
- **Poner $n$ barras en lugar de $n - 1$.** Para separar $n$ grupos se necesitan $n - 1$ divisiones.
- **Aplicarlo a objetos distinguibles.** Si las becas tienen nombre, cada una elige escuela por separado y hay $3^{10}$ repartos.

## Conexiones

Estrellas y barras reduce el conteo de multiconjuntos a las [[combinaciones]] mediante una biyección, como en [[funciones-inyectivas-suprayectivas-y-biyectivas]]. Las soluciones enteras de ecuaciones reaparecen en las [[particiones-de-enteros]], donde el orden de los sumandos tampoco importa pero los grupos no están etiquetados, y en las [[funciones-generadoras-ordinarias]]. En probabilidad, este conteo describe la estadística de Bose y Einstein.
