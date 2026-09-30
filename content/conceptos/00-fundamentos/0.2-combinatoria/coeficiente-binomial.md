---
id: coeficiente-binomial
titulo: Coeficiente binomial
titulo_en: Binomial coefficient
alias:
  - n sobre k
  - número combinatorio
  - n en k
modulo: 0
submodulo: '0.2'
orden: 10
nivel: basico
prerrequisitos:
  - combinaciones
etiquetas:
  - conteo
  - coeficiente binomial
  - caminos en una rejilla
  - subconjuntos
resumen: >
  El coeficiente binomial C(n, k) cuenta los subconjuntos de tamaño k de un conjunto de n elementos.
  También cuenta los caminos en una rejilla y las palabras con k letras de un tipo y n - k de otro.
formula: '\binom{n}{k} = \frac{n!}{k!\,(n-k)!}'
visualizacion:
  componente: PascalTriangle
  parametros:
    modo: caminos
    derecha: 4
    arriba: 3
referencias:
  - clave: blitzstein-hwang
  - clave: ross-probabilidad
    capitulo: '1'
publicado: true
---

## Intuición

Un repartidor en bicicleta debe ir de una esquina de la ciudad a otra que está 4 cuadras al este y 3 al norte, sin alejarse nunca de su destino: en cada esquina solo avanza al este o al norte. Cualquier trayecto consta de 7 tramos, de los cuales 4 son al este y 3 al norte. Un trayecto queda determinado por cuáles de los 7 tramos son hacia el norte; por ejemplo, norte, este, este, norte, este, norte, este.

Así, contar trayectos es contar las maneras de elegir 3 posiciones entre 7, que es $\binom{7}{3} = 35$. El mismo número cuenta los subconjuntos de 3 elementos de un conjunto de 7 y las palabras con 3 letras N y 4 letras E. Esta capacidad de contar cosas en apariencia distintas es lo que hace del coeficiente binomial uno de los números más presentes en la matemática: aparece al elegir, al desarrollar potencias y al calcular probabilidades.

## Definición

:::definicion[Coeficiente binomial]
Para enteros $0 \le k \le n$,
$$
\binom{n}{k} = \frac{n!}{k!\,(n-k)!} = \frac{n(n-1)\cdots(n-k+1)}{k!},
$$
y se define $\binom{n}{k} = 0$ si $k < 0$ o $k > n$.
:::

Se lee "$n$ en $k$" o "$n$ sobre $k$". Son equivalentes las siguientes interpretaciones de $\binom{n}{k}$:

1. el número de subconjuntos de tamaño $k$ de un conjunto de $n$ elementos;
2. el número de palabras de longitud $n$ con $k$ letras $a$ y $n - k$ letras $b$;
3. el número de caminos en la rejilla desde $(0, 0)$ hasta $(n - k, k)$ con pasos unitarios a la derecha y hacia arriba.

:::nota[Qué significa cada símbolo]
- $n$: número de elementos o de pasos.
- $k$: número de elementos elegidos, o de pasos en una dirección.
- $\binom{n}{k}$: coeficiente binomial, "$n$ en $k$".
- $(n - k, k)$: punto de llegada en la rejilla, $n - k$ pasos a la derecha y $k$ hacia arriba.
- $e \approx 2.71828$: base de los logaritmos naturales, en la cota superior.
- $\lfloor n/2 \rfloor$: parte entera de $n/2$.
:::

## Cómo usar la visualización

Cada punto de la rejilla indica cuántos caminos llegan a él desde la esquina inferior izquierda. La reproducción dibuja todos los caminos hasta la esquina opuesta, uno por uno, y escribe el actual como una palabra de pasos R (derecha) y U (arriba). Los controles cambian las dimensiones.

El número de cada punto es la suma del que está a su izquierda y del que está debajo, porque todo camino llega por uno de esos dos lados. Leídos por diagonales, esos números reconstruyen el triángulo de Pascal. Al intercambiar los valores de $a$ y $b$ el número total no cambia, lo que ilustra la simetría $\binom{7}{3} = \binom{7}{4}$.

## Ejemplo

Un control de calidad inspecciona 12 piezas de un lote, de las cuales 4 están defectuosas, y extrae 3 sin reemplazo.

1. Muestras posibles: $\binom{12}{3} = \frac{12 \cdot 11 \cdot 10}{6} = 220$.
2. Muestras sin defectuosas: se eligen 3 de las 8 buenas, $\binom{8}{3} = 56$.
3. Muestras con exactamente una defectuosa: $\binom{4}{1}\binom{8}{2} = 4 \cdot 28 = 112$.
4. Muestras con al menos una defectuosa: $220 - 56 = 164$.
5. Si las muestras son igualmente probables, la probabilidad de detectar al menos una pieza defectuosa es $164/220 \approx 0.745$.

:::figura[Las 220 muestras posibles del ejemplo separadas por el número de piezas defectuosas que contienen: $\binom{8}{3} = 56$ sin defectuosas, $\binom{4}{1}\binom{8}{2} = 112$ con una, $\binom{4}{2}\binom{8}{1} = 48$ con dos y $\binom{4}{3} = 4$ con tres.]{componente="SetStructures"}
```yaml
modo: reparto
universo: Muestras de 3 piezas
bloques:
  - nombre: 0 defectuosas
    n: 56
  - nombre: 1 defectuosa
    n: 112
  - nombre: 2 defectuosas
    n: 48
  - nombre: 3 defectuosas
    n: 4
```
:::

## Propiedades

- **Simetría:** $\binom{n}{k} = \binom{n}{n-k}$.
- **Regla de Pascal:** $\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}$.
- **Suma de una fila:** $\sum_{k} \binom{n}{k} = 2^n$.
- **Unimodalidad:** para $n$ fijo, $\binom{n}{k}$ crece hasta $k = \lfloor n/2 \rfloor$ y luego decrece.
- **Cota útil:** $\left(\frac{n}{k}\right)^k \le \binom{n}{k} \le \left(\frac{en}{k}\right)^k$.
- **Teorema del binomio:** $\binom{n}{k}$ es el coeficiente de $a^{n-k}b^{k}$ en $(a + b)^n$.

## Errores comunes

- **Confundir $\binom{n}{k}$ con $\frac{n}{k}$.** La notación no es una fracción.
- **Calcular factoriales completos.** $\binom{100}{3}$ se obtiene como $\frac{100 \cdot 99 \cdot 98}{6} = 161700$ sin calcular $100!$.
- **Usarlo cuando el orden importa.** El coeficiente binomial cuenta selecciones sin orden.
- **Aplicarlo con $k > n$ como si tuviera sentido.** No hay subconjuntos de 5 elementos en un conjunto de 3, y por convención el valor es 0.

## Conexiones

El coeficiente binomial es el número de [[combinaciones]] y cumple las [[identidades-del-coeficiente-binomial]] que organizan el [[triangulo-de-pascal]]. Da nombre al [[teorema-del-binomio]] y se generaliza al [[coeficiente-multinomial]]. Los caminos en la rejilla reaparecen en los [[numeros-de-catalan]] cuando se prohíbe cruzar la diagonal. En probabilidad, las distribuciones binomial e hipergeométrica tienen el coeficiente binomial en su fórmula.

## Formulario

:::formula[Coeficiente binomial]
$$
\binom{n}{k} = \frac{n!}{k!\,(n-k)!}, \qquad \binom{n}{k} = 0 \text{ si } k < 0 \text{ o } k > n
$$

- $n$: tamaño del conjunto.
- $k$: tamaño del subconjunto.
:::

:::formula[Regla de Pascal]
$$
\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}
$$

- Se separa según un elemento fijo esté o no en el subconjunto.
:::

:::formula[Cotas]
$$
\left(\frac{n}{k}\right)^{k} \le \binom{n}{k} \le \left(\frac{en}{k}\right)^{k}
$$

- $e$: base de los logaritmos naturales.
:::

:::formula[Muestreo sin reemplazo]
$$
\#\{\text{muestras con } j \text{ defectuosas}\} = \binom{D}{j}\binom{N - D}{m - j}
$$

- $N$: tamaño del lote; $D$: defectuosas en el lote.
- $m$: tamaño de la muestra; $j$: defectuosas en la muestra.
:::
