---
id: base-y-dimension
titulo: Base y dimensión
titulo_en: Basis and dimension
alias:
  - base de un espacio vectorial
  - base canónica
  - dimensión
  - coordenadas en una base
modulo: 0
submodulo: '0.3'
orden: 5
nivel: basico
prerrequisitos:
  - independencia-lineal
etiquetas:
  - base
  - dimensión
  - coordenadas
  - base canónica
resumen: >
  Una base es un conjunto de vectores independientes que genera todo el espacio; cada vector se escribe
  de forma única con ella, y la dimensión es el número de vectores que tiene cualquier base.
formula: '\dim V = n \iff V \text{ tiene una base } \{\mathbf{b}_1, \dots, \mathbf{b}_n\}'
visualizacion:
  componente: VectorPlane
  parametros:
    modo: combinacion
    v1: [1, 1]
    v2: [1, -1]
    coeficientes: [3, 2]
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '2'
publicado: true
---

## Intuición

Para dar una dirección en una ciudad con calles en cuadrícula basta decir cuántas cuadras al este y cuántas al norte. Las dos direcciones "una cuadra al este" y "una cuadra al norte" forman una base: con ellas se llega a cualquier esquina, y de una sola manera. Si se agregara una tercera instrucción, "una cuadra en diagonal", sobraría, porque ya se obtiene combinando las otras dos. Si se quitara una, habría lugares inalcanzables.

Una base es exactamente eso: suficientes vectores para llegar a todas partes y ninguno de más. Puede haber muchas bases distintas, como calles que corren en diagonal, pero todas tienen el mismo número de vectores. Ese número es la dimensión del espacio: 2 para el plano, 3 para el espacio físico y $n$ para las listas de $n$ datos. Los números que indican cuánto de cada vector de la base se usa son las coordenadas del punto en esa base.

## Definición

:::definicion[Base y dimensión]
Un conjunto $\{\mathbf{b}_1, \dots, \mathbf{b}_n\}$ de un espacio vectorial $V$ es una **base** si sus vectores son linealmente independientes y generan $V$. Entonces cada $\mathbf{x} \in V$ se escribe de forma única como
$$
\mathbf{x} = c_1\mathbf{b}_1 + \dots + c_n\mathbf{b}_n,
$$
y los números $(c_1, \dots, c_n)$ son las **coordenadas** de $\mathbf{x}$ en esa base. Todas las bases de $V$ tienen el mismo número de elementos, llamado **dimensión** de $V$ y denotado $\dim V$.
:::

La **base canónica** de $\mathbb{R}^n$ está formada por $\mathbf{e}_1 = (1, 0, \dots, 0), \dots, \mathbf{e}_n = (0, \dots, 0, 1)$, y en ella las coordenadas de un vector son sus propias componentes. El espacio $\{\mathbf{0}\}$ tiene dimensión 0.

:::nota[Qué significa cada símbolo]
- $\mathbf{b}_1, \dots, \mathbf{b}_n$: vectores de la base.
- $n$: número de vectores de la base, igual a la dimensión.
- $\mathbf{x}$: vector cualquiera de $V$.
- $c_i$: coordenada $i$ de $\mathbf{x}$ en la base.
- $\dim V$: dimensión del espacio $V$.
- $\mathbf{e}_i$: vector $i$ de la base canónica, con un 1 en la posición $i$ y ceros en las demás.
:::

## Cómo usar la visualización

Los vectores $\mathbf{v}_1 = (1, 1)$ y $\mathbf{v}_2 = (1, -1)$ forman una base del plano. Los controles $a$ y $b$ son las coordenadas del punto naranja en esa base, construido punta con cola. La reproducción agrega los puntos con coordenadas enteras, que forman una rejilla girada 45 grados.

Con $a = 3$ y $b = 2$ el punto es $(5, 1)$: esas son sus coordenadas en la base, distintas de sus componentes. Cada punto de la rejilla se alcanza con un único par $(a, b)$. Al arrastrar $\mathbf{v}_2$ hasta hacerlo paralelo a $\mathbf{v}_1$ el conjunto deja de ser base: ya no genera el plano y las coordenadas dejan de existir para casi todos los puntos.

## Ejemplo

Un sensor registra la temperatura de dos cuartos como $\mathbf{x} = (5, 1)$ grados sobre un valor de referencia. Conviene describirla con el promedio y la diferencia, usando la base $\mathbf{b}_1 = (1, 1)$, $\mathbf{b}_2 = (1, -1)$.

1. Se plantea $c_1(1, 1) + c_2(1, -1) = (5, 1)$: $c_1 + c_2 = 5$ y $c_1 - c_2 = 1$.
2. Sumando, $2c_1 = 6$, así que $c_1 = 3$; restando, $2c_2 = 4$, así que $c_2 = 2$.
3. Las coordenadas de $\mathbf{x}$ en la nueva base son $(3, 2)$: un nivel común de 3 grados y una diferencia de $\pm 2$ grados.
4. La base es válida porque $\det\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix} = -2 \neq 0$: los vectores son independientes y, siendo dos en un espacio de dimensión 2, generan el plano.

:::figura[Las mismas temperaturas en dos bases. La rejilla girada es la de la base promedio y diferencia; el punto (5, 1) tiene coordenadas (3, 2) en ella.]{componente="VectorPlane"}
```yaml
modo: cambio-base
b1: [1, 1]
b2: [1, -1]
punto: [5, 1]
```
:::

## Propiedades

- **Unicidad de coordenadas:** en una base, cada vector tiene exactamente un juego de coordenadas.
- **Invariancia del tamaño:** todas las bases de un espacio tienen el mismo número de vectores.
- **Criterios rápidos en dimensión $n$:** $n$ vectores independientes ya son base; $n$ vectores que generan ya son base.
- **Límites:** en un espacio de dimensión $n$, un conjunto independiente tiene a lo más $n$ vectores y un conjunto generador tiene al menos $n$.
- **Completar y recortar:** todo conjunto independiente se puede completar hasta una base, y todo conjunto generador se puede recortar hasta una base.
- **Ejemplos de dimensión:** $\dim \mathbb{R}^n = n$, $\dim \mathcal{P}_d = d + 1$ para polinomios de grado a lo más $d$, y las matrices de $m \times n$ tienen dimensión $mn$.

:::figura[Casos en R³: tres vectores independientes forman una base del espacio, mientras que dos vectores, aunque sean independientes, solo generan un plano y no son base.]{componente="Space3D"}
```yaml
modo: generado
conjuntos:
  - nombre: Base de R³
    vectores: [[2, 0, 0], [1, 2, 0], [0, 1, 2]]
  - nombre: Dos vectores, no es base
    vectores: [[2, 0, 0], [1, 2, 0]]
```
:::

:::demostracion
Idea de la invariancia: si un espacio está generado por $m$ vectores, cualquier conjunto con más de $m$ vectores es dependiente (se prueba reduciendo un sistema homogéneo con más incógnitas que ecuaciones). Si hubiera bases con $m$ y con $n > m$ vectores, la segunda sería dependiente, lo cual es imposible.
:::

## Errores comunes

- **Confundir coordenadas con componentes.** En la base $(1, 1), (1, -1)$ el vector $(5, 1)$ tiene coordenadas $(3, 2)$; solo en la base canónica coinciden.
- **Creer que la base es única.** Un espacio no trivial tiene infinitas bases; lo único fijo es cuántos vectores tienen.
- **Pensar que la dimensión cuenta los elementos del espacio.** $\mathbb{R}^2$ tiene infinitos vectores y dimensión 2.
- **Olvidar alguna de las dos condiciones.** Un conjunto independiente que no genera, o uno que genera pero es dependiente, no es base.

## Conexiones

Una base combina la [[independencia-lineal]] con la propiedad de generar el espacio, vista en la [[combinacion-lineal-y-espacio-generado|combinación lineal]]. La dimensión permite clasificar los [[subespacios]] y medir el [[rango-de-una-matriz]]. Pasar de unas coordenadas a otras es el [[cambio-de-base]], y las bases de vectores perpendiculares se estudian en [[ortogonalidad-y-ortonormalidad]]. En análisis de componentes principales se elige la base que ordena los datos por varianza.

## Formulario

:::formula[Coordenadas en una base]
$$
\mathbf{x} = c_1\mathbf{b}_1 + \dots + c_n\mathbf{b}_n, \qquad [\mathbf{x}]_B = (c_1, \dots, c_n)
$$

- $B = \{\mathbf{b}_1, \dots, \mathbf{b}_n\}$: base del espacio.
- $c_i$: coordenada de $\mathbf{x}$ respecto a $\mathbf{b}_i$.
- $[\mathbf{x}]_B$: vector de coordenadas de $\mathbf{x}$ en la base $B$.
:::

:::formula[Base canónica]
$$
\mathbf{x} = x_1\mathbf{e}_1 + \dots + x_n\mathbf{e}_n
$$

- $\mathbf{e}_i$: vector con 1 en la posición $i$ y 0 en las demás.
- $x_i$: componente $i$ de $\mathbf{x}$.
:::

:::formula[Dimensiones de espacios usuales]
$$
\dim \mathbb{R}^n = n, \qquad \dim \mathcal{P}_d = d + 1, \qquad \dim \mathbb{R}^{m \times n} = mn
$$

- $\mathcal{P}_d$: polinomios de grado a lo más $d$.
- $\mathbb{R}^{m \times n}$: matrices de $m$ filas y $n$ columnas.
:::
