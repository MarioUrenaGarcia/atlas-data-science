---
id: permutaciones
titulo: Permutaciones
titulo_en: Permutations
alias:
  - permutación
  - ordenaciones
  - arreglos de n objetos
modulo: 0
submodulo: '0.2'
orden: 4
nivel: basico
prerrequisitos:
  - factorial
relaciones:
  - tipo: relacionado
    id: funciones-inyectivas-suprayectivas-y-biyectivas
etiquetas:
  - conteo
  - orden
  - permutaciones
  - biyecciones
resumen: >
  Una permutación de n objetos distintos es un ordenamiento de todos ellos. Hay n! permutaciones, porque
  la primera posición admite n opciones, la segunda n - 1, y así hasta la última.
formula: 'P_n = n!'
visualizacion:
  componente: CombinatoricsBoard
  parametros:
    modo: ordenaciones
    objetos: [Ana, Beto, Caro, Dani]
    k: 4
referencias:
  - clave: ross-probabilidad
    capitulo: '1'
publicado: true
---

## Intuición

Cuatro corredores, Ana, Beto, Caro y Dani, forman un equipo de relevos y deben decidir quién corre cada tramo. Una forma de contar los órdenes posibles es llenar las posiciones una por una: para el primer tramo hay cuatro candidatos; para el segundo quedan tres, porque nadie corre dos tramos; para el tercero quedan dos; y el último tramo lo corre quien falta. En total hay $4 \cdot 3 \cdot 2 \cdot 1 = 24$ órdenes.

Cada orden es una permutación del equipo. La característica esencial es que se usan todos los objetos, cada uno exactamente una vez, y que el orden importa: Ana, Beto, Caro, Dani es un relevo distinto de Dani, Caro, Beto, Ana. Si se piensa en las posiciones como etiquetas 1, 2, 3, 4, una permutación es una forma de asignar a cada corredor una posición distinta, es decir, una biyección entre el equipo y las posiciones.

## Definición

:::definicion[Permutación]
Una **permutación** de un conjunto finito $A$ con $n$ elementos es una sucesión $(a_1, \dots, a_n)$ en la que cada elemento de $A$ aparece exactamente una vez. Equivalentemente, es una función biyectiva $\sigma: \{1, \dots, n\} \to A$.
:::

:::teorema
El número de permutaciones de $n$ objetos distintos es $n!$.
:::

Las permutaciones de $\{1, \dots, n\}$ en sí mismo forman el **grupo simétrico** $S_n$: la composición de dos permutaciones es una permutación y toda permutación tiene inversa.

## Cómo usar la visualización

Las casillas representan las posiciones del relevo y, debajo de cada una, el número de corredores disponibles en ese momento: 4, 3, 2 y 1. La reproducción lista todas las ordenaciones en orden alfabético y muestra la última en las casillas. El panel lleva el total $4! = 24$.

Al aumentar el número de objetos disponibles, las opciones de la primera casilla crecen y la lista se alarga mucho más rápido que el número de corredores. Si se reduce el número de posiciones por debajo del número de objetos, ya no se usan todos y el resultado deja de ser una permutación: se obtienen variaciones.

## Ejemplo

Una estación de radio programa 6 canciones distintas en un bloque sin repetir ninguna.

1. Las canciones se pueden ordenar de $6! = 720$ maneras.
2. Si la canción más solicitada debe ir al final, quedan 5 canciones para las primeras 5 posiciones: $5! = 120$ órdenes.
3. Si dos canciones del mismo artista deben ir juntas, se tratan como un solo bloque: hay $5!$ órdenes de los 5 bloques y $2!$ órdenes dentro del bloque, en total $5! \cdot 2! = 240$.
4. Por complemento, los órdenes en que esas dos canciones no quedan juntas son $720 - 240 = 480$.

:::figura[Los tres casos del ejemplo de la radio. Sin restricciones hay $6! = 720$ órdenes; con la canción favorita fija al final, esa casilla tiene una sola opción; con dos canciones pegadas se ordenan 5 bloques y se multiplica por los 2 órdenes dentro del bloque.]{componente="CombinatoricsBoard"}
```yaml
modo: casillas
escenarios:
  - nombre: Sin restricciones
    casillas:
      - etiqueta: pos. 1
        opciones: 6
      - etiqueta: pos. 2
        opciones: 5
      - etiqueta: pos. 3
        opciones: 4
      - etiqueta: pos. 4
        opciones: 3
      - etiqueta: pos. 5
        opciones: 2
      - etiqueta: pos. 6
        opciones: 1
  - nombre: Favorita al final
    casillas:
      - etiqueta: pos. 1
        opciones: 5
      - etiqueta: pos. 2
        opciones: 4
      - etiqueta: pos. 3
        opciones: 3
      - etiqueta: pos. 4
        opciones: 2
      - etiqueta: pos. 5
        opciones: 1
      - etiqueta: favorita
        opciones: 1
  - nombre: Dos canciones juntas
    casillas:
      - etiqueta: bloque 1
        opciones: 5
      - etiqueta: bloque 2
        opciones: 4
      - etiqueta: bloque 3
        opciones: 3
      - etiqueta: bloque 4
        opciones: 2
      - etiqueta: bloque 5
        opciones: 1
      - etiqueta: dentro del par
        opciones: 2
```
:::

## Propiedades

- **Recursión:** las permutaciones de $n$ objetos se obtienen insertando el objeto $n$ en cualquiera de las $n$ posiciones de cada permutación de los otros $n - 1$, lo que da $n \cdot (n-1)!$.
- **Inversa:** toda permutación $\sigma$ tiene inversa $\sigma^{-1}$, y $\sigma \circ \sigma^{-1}$ es la identidad.
- **Ciclos:** toda permutación se descompone en ciclos disjuntos; por ejemplo, $1 \mapsto 3 \mapsto 2 \mapsto 1$ con $4$ fijo.
- **Puntos fijos:** un elemento $i$ con $\sigma(i) = i$ es un punto fijo; las permutaciones sin puntos fijos son los desarreglos.
- **Bloques:** si $k$ objetos deben quedar juntos, se cuentan como un solo bloque y se multiplica por $k!$.

## Errores comunes

- **Usar $n^n$ en lugar de $n!$.** Eso cuenta las sucesiones con repetición; en una permutación ningún objeto se repite.
- **Aplicar $n!$ cuando hay objetos idénticos.** Las permutaciones de las letras de OSO no son $3! = 6$ sino 3, porque las dos O son indistinguibles.
- **Olvidar el orden interno de un bloque.** Al pegar objetos que deben quedar juntos, hay que multiplicar por los órdenes dentro del bloque.

## Conexiones

Las permutaciones cuentan con el [[factorial]] y son las biyecciones estudiadas en [[funciones-inyectivas-suprayectivas-y-biyectivas]]. Al elegir solo algunas posiciones se obtienen [[variaciones]]; con objetos repetidos, [[permutaciones-con-repeticion]]; en una mesa redonda, [[permutaciones-circulares]]; y sin puntos fijos, [[desarreglos]]. En estadística, las pruebas de permutación comparan un estadístico con su valor bajo reordenamientos aleatorios de las etiquetas.
