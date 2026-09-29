---
id: desarreglos
titulo: Desarreglos
titulo_en: Derangements
alias:
  - permutaciones sin puntos fijos
  - subfactorial
  - problema de los sombreros
  - problema de las coincidencias
modulo: 0
submodulo: '0.2'
orden: 17
nivel: basico
prerrequisitos:
  - permutaciones
  - principio-de-inclusion-y-exclusion
etiquetas:
  - permutaciones
  - puntos fijos
  - inclusión y exclusión
  - número e
resumen: >
  Un desarreglo es una permutación en la que ningún objeto queda en su lugar original. Hay D(n) = n! suma
  (-1)^k/k! de ellos, y la proporción D(n)/n! se acerca rápidamente a 1/e.
formula: 'D_n = n! \sum_{k=0}^{n} \frac{(-1)^k}{k!} \approx \frac{n!}{e}'
visualizacion:
  componente: DerangementsViz
  parametros:
    n: 6
referencias:
  - clave: ross-probabilidad
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Al terminar una fiesta, los abrigos de $n$ invitados se devuelven al azar. ¿Qué tan probable es que nadie reciba el suyo? Con 2 invitados, la mitad de las veces se intercambian y nadie recibe el propio. Con 3 invitados, de los 6 órdenes posibles solo 2 dejan a todos sin su abrigo. Uno esperaría que, con muchos invitados, fuera casi seguro que alguien reciba el suyo, o casi seguro que nadie. Ninguna de las dos cosas ocurre.

La proporción de repartos sin ninguna coincidencia se estabiliza muy rápido en un valor cercano a $0.368$, que es $1/e$. Con 6 invitados o con 6 millones, la probabilidad de que nadie reciba su abrigo es prácticamente la misma. Estas permutaciones sin ninguna coincidencia se llaman desarreglos, y contarlas es un ejemplo clásico de inclusión y exclusión: es más fácil contar los repartos donde ciertos invitados sí reciben su abrigo que contar directamente los que no tienen ninguno.

## Definición

:::definicion[Desarreglo]
Un **desarreglo** de $\{1, \dots, n\}$ es una permutación $\sigma$ sin puntos fijos: $\sigma(i) \neq i$ para todo $i$. Su número se denota $D_n$ o $!n$.
:::

:::teorema
$$
D_n = n! \sum_{k=0}^{n} \frac{(-1)^k}{k!}, \qquad D_n = (n-1)\left(D_{n-1} + D_{n-2}\right),
$$
con $D_0 = 1$ y $D_1 = 0$. Además, $D_n$ es el entero más cercano a $n!/e$ para $n \ge 1$.
:::

:::demostracion
Sea $A_i$ el conjunto de permutaciones que fijan $i$. Las permutaciones que fijan un conjunto dado de $k$ elementos son $(n-k)!$, y hay $\binom{n}{k}$ conjuntos así. Por inclusión y exclusión, las permutaciones sin puntos fijos son $\sum_{k=0}^{n} (-1)^k \binom{n}{k}(n-k)! = \sum_{k=0}^{n} (-1)^k \frac{n!}{k!}$.
:::

## Cómo usar la visualización

Arriba se ve el último reparto: bajo cada invitado aparece el abrigo que recibió, resaltado si es el suyo. Cada ensayo es una permutación al azar; el histograma acumula cuántas veces se obtuvieron 0, 1, 2, ... coincidencias y las líneas marcan la probabilidad exacta. El panel compara la proporción simulada sin coincidencias con $D_n/n!$ y con $1/e$.

Al cambiar el número de invitados de 6 a 10, la barra de cero coincidencias casi no cambia: la probabilidad exacta pasa de 0.3681 a 0.3679. Con 2 invitados, en cambio, vale 0.5. La tabla de datos muestra lo rápido que $D_n/n!$ se estabiliza.

## Ejemplo

Cinco estudiantes intercambian sus exámenes al azar para calificarlos entre pares, y nadie debe calificar el propio.

1. Repartos posibles: $5! = 120$.
2. Repartos válidos: $D_5 = 120\left(1 - 1 + \tfrac{1}{2} - \tfrac{1}{6} + \tfrac{1}{24} - \tfrac{1}{120}\right) = 60 - 20 + 5 - 1 = 44$.
3. Con la recursión: $D_3 = 2$, $D_4 = 3(2 + 1) = 9$, $D_5 = 4(9 + 2) = 44$.
4. La probabilidad de que un reparto al azar sea válido es $44/120 \approx 0.367$, y $120/e \approx 44.1$ redondea a 44.

:::figura[Los 5 estudiantes del ejemplo: cada ensayo es un reparto al azar de los exámenes y el histograma cuenta cuántos reciben el propio. La barra de cero coincidencias se acerca a $44/120 \approx 0.367$.]{componente="DerangementsViz"}
```yaml
n: 5
```
:::

:::figura[Las 120 permutaciones de 5 elementos separadas por su número de puntos fijos: 44 desarreglos, 45 con uno, 20 con dos, 10 con tres y 1 con cinco. Ninguna tiene exactamente cuatro, porque si cuatro quedan en su lugar el quinto también.]{componente="SetStructures"}
```yaml
modo: reparto
universo: Permutaciones de 5
bloques:
  - nombre: 0 fijos
    n: 44
  - nombre: 1 fijo
    n: 45
  - nombre: 2 fijos
    n: 20
  - nombre: 3 fijos
    n: 10
  - nombre: 5 fijos
    n: 1
```
:::

## Propiedades

- **Primeros valores:** $D_0, \dots, D_6 = 1, 0, 1, 2, 9, 44, 265$.
- **Límite:** $\frac{D_n}{n!} \to e^{-1}$, con un error menor que $\frac{1}{(n+1)!}$.
- **Recursión de primer orden:** $D_n = n D_{n-1} + (-1)^n$.
- **Exactamente $k$ puntos fijos:** hay $\binom{n}{k} D_{n-k}$ permutaciones con exactamente $k$ puntos fijos.
- **Número esperado de coincidencias:** en una permutación al azar es exactamente 1 para todo $n \ge 1$, y su distribución se aproxima a una Poisson de media 1.

## Errores comunes

- **Pensar que la probabilidad de ninguna coincidencia tiende a 0 o a 1.** Se estabiliza en $1/e \approx 0.368$.
- **Contar con $(n-1)^n$.** Eso supondría que cada invitado elige un abrigo ajeno por separado, permitiendo que dos reciban el mismo.
- **Confundir "ninguna coincidencia" con "no todas coinciden".** Esta última es el complemento de un solo caso: $n! - 1$.

## Conexiones

Los desarreglos son [[permutaciones]] sin puntos fijos y su fórmula es una aplicación directa del [[principio-de-inclusion-y-exclusion]]. La recursión es una de las [[relaciones-de-recurrencia-lineales|relaciones de recurrencia]] del submódulo, con coeficientes variables, y la función generadora exponencial de $D_n$ es $e^{-x}/(1-x)$, tema de las [[funciones-generadoras-exponenciales]]. En probabilidad, el problema de las coincidencias es un ejemplo temprano de aproximación de Poisson.
