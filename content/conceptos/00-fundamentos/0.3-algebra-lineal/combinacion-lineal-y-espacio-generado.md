---
id: combinacion-lineal-y-espacio-generado
titulo: Combinación lineal y espacio generado
titulo_en: Linear combination and span
alias:
  - span
  - espacio generado
  - envolvente lineal
  - combinación lineal
modulo: 0
submodulo: '0.3'
orden: 3
nivel: basico
prerrequisitos:
  - espacios-vectoriales
etiquetas:
  - combinación lineal
  - span
  - espacio generado
  - coeficientes
resumen: >
  Una combinación lineal suma múltiplos de varios vectores; el espacio generado es el conjunto de todas
  las combinaciones posibles, que siempre es una recta, un plano o un espacio que pasa por el origen.
formula: '\operatorname{gen}\{\mathbf{v}_1, \dots, \mathbf{v}_k\} = \{c_1\mathbf{v}_1 + \dots + c_k\mathbf{v}_k : c_i \in \mathbb{R}\}'
visualizacion:
  componente: VectorPlane
  parametros:
    modo: combinacion
    v1: [2, 1]
    v2: [-1, 1]
    coeficientes: [1.5, 1]
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '2'
publicado: true
---

## Intuición

Una tienda de pinturas prepara colores mezclando dos bases en distintas cantidades. Cada mezcla es una **combinación lineal**: tantas partes de la primera base más tantas partes de la segunda. El conjunto de todos los colores que se pueden obtener así es el **espacio generado** por las dos bases.

Con flechas pasa lo mismo. Con un solo vector no nulo solo se alcanzan sus múltiplos, que forman una recta por el origen. Con dos vectores que apuntan en direcciones distintas del plano se alcanza cualquier punto: basta estirar cada uno lo necesario y ponerlos punta con cola. Pero si los dos vectores están sobre la misma recta, mezclarlos no aporta nada nuevo y lo generado sigue siendo esa recta. La pregunta de qué se puede alcanzar con ciertos ingredientes es la pregunta central de los sistemas de ecuaciones lineales.

## Definición

:::definicion[Combinación lineal y espacio generado]
Dados vectores $\mathbf{v}_1, \dots, \mathbf{v}_k$ de un espacio vectorial $V$, una **combinación lineal** de ellos es un vector de la forma
$$
c_1\mathbf{v}_1 + c_2\mathbf{v}_2 + \dots + c_k\mathbf{v}_k, \qquad c_1, \dots, c_k \in \mathbb{R}.
$$
El **espacio generado** es el conjunto de todas sus combinaciones lineales:
$$
\operatorname{gen}\{\mathbf{v}_1, \dots, \mathbf{v}_k\} = \{c_1\mathbf{v}_1 + \dots + c_k\mathbf{v}_k : c_i \in \mathbb{R}\}.
$$
:::

Por convención, el espacio generado por el conjunto vacío es $\{\mathbf{0}\}$. Se dice que los vectores **generan** $V$ cuando su espacio generado es todo $V$.

:::nota[Qué significa cada símbolo]
- $\mathbf{v}_1, \dots, \mathbf{v}_k$: vectores dados de $V$.
- $k$: número de vectores.
- $c_i$: coeficiente o peso del vector $\mathbf{v}_i$, un número real.
- $\operatorname{gen}\{\cdot\}$: espacio generado, también escrito $\operatorname{span}\{\cdot\}$.
- $V$: espacio vectorial que contiene a los vectores.
- $\mathbf{0}$: vector cero.
:::

## Cómo usar la visualización

Las puntas de $\mathbf{v}_1$ y $\mathbf{v}_2$ se arrastran y los controles fijan los coeficientes $a$ y $b$. La flecha naranja es $a\mathbf{v}_1 + b\mathbf{v}_2$, construida punta con cola. La reproducción agrega, anillo por anillo, los puntos con coeficientes enteros; el panel indica si los vectores generan todo el plano o solo una recta.

Con los vectores iniciales, los puntos llenan el plano en una rejilla inclinada. Al arrastrar $\mathbf{v}_2$ hasta alinearla con $\mathbf{v}_1$, el determinante se anula y todos los puntos caen en una sola recta. Con $b = 0$, la combinación recorre solo la recta de $\mathbf{v}_1$.

## Ejemplo

En una fábrica, un lote del producto A usa $(1, 2)$ toneladas de acero y cobre, y un lote de B usa $(3, 1)$. Se busca cuántos lotes de cada uno consumen exactamente $(7, 4)$ toneladas.

1. Se plantea $a(1, 2) + b(3, 1) = (7, 4)$, es decir, $a + 3b = 7$ y $2a + b = 4$.
2. De la segunda ecuación, $b = 4 - 2a$. Sustituyendo en la primera: $a + 12 - 6a = 7$, así que $a = 1$.
3. Entonces $b = 4 - 2 = 2$.
4. Comprobación: $1\cdot(1, 2) + 2\cdot(3, 1) = (1 + 6, 2 + 2) = (7, 4)$.
5. Como $(1, 2)$ y $(3, 1)$ no son paralelos, generan todo el plano: cualquier consumo $(x, y)$ se alcanza con algún par de coeficientes, aunque puedan salir negativos.

:::figura[La combinación del ejemplo: una vez el vector (1, 2) y dos veces el vector (3, 1) llegan exactamente a (7, 4). Los puntos de coeficientes enteros muestran que estos dos vectores generan todo el plano.]{componente="VectorPlane"}
```yaml
modo: combinacion
v1: [1, 2]
v2: [3, 1]
coeficientes: [1, 2]
```
:::

## Propiedades

- **Es un subespacio:** el espacio generado contiene al cero y es cerrado bajo suma y producto por escalar.
- **Es el menor subespacio que contiene a los vectores:** cualquier subespacio que contenga a $\mathbf{v}_1, \dots, \mathbf{v}_k$ contiene a todas sus combinaciones.
- **Agregar vectores no lo achica:** $\operatorname{gen}\{\mathbf{v}_1\} \subseteq \operatorname{gen}\{\mathbf{v}_1, \mathbf{v}_2\}$.
- **Vectores redundantes:** si $\mathbf{v}_k$ ya es combinación de los demás, quitarlo no cambia el espacio generado.
- **Forma en $\mathbb{R}^3$:** el espacio generado por vectores de $\mathbb{R}^3$ es el origen, una recta, un plano o todo el espacio, siempre pasando por el origen.

:::figura[Casos del espacio generado en R³. Un vector genera una recta, dos vectores no paralelos generan un plano y tres vectores que no están en un mismo plano generan todo el espacio.]{componente="Space3D"}
```yaml
modo: generado
conjuntos:
  - nombre: Un vector, una recta
    vectores: [[2, 1, 1]]
  - nombre: Dos vectores, un plano
    vectores: [[2, 1, 1], [-1, 2, 0]]
  - nombre: Tres vectores, todo el espacio
    vectores: [[2, 1, 1], [-1, 2, 0], [0, 0, 2]]
```
:::

:::demostracion
Si $\mathbf{x} = \sum c_i\mathbf{v}_i$ y $\mathbf{y} = \sum d_i\mathbf{v}_i$, entonces $\mathbf{x} + \mathbf{y} = \sum (c_i + d_i)\mathbf{v}_i$ y $a\mathbf{x} = \sum (a c_i)\mathbf{v}_i$ son otra vez combinaciones, y tomando todos los coeficientes cero se obtiene $\mathbf{0}$.
:::

## Errores comunes

- **Pensar que dos vectores siempre generan el plano.** Si uno es múltiplo del otro, solo generan una recta.
- **Restringir los coeficientes a positivos.** Con coeficientes no negativos se obtiene un cono, no el espacio generado; los coeficientes pueden ser cualesquiera reales.
- **Creer que el espacio generado puede no pasar por el origen.** Con todos los coeficientes en cero siempre se obtiene $\mathbf{0}$.
- **Confundir "está en el espacio generado" con "es uno de los vectores".** $(7, 4)$ no es ninguno de los dos vectores del ejemplo y sí está en lo que generan.

## Conexiones

La combinación lineal usa las operaciones de los [[espacios-vectoriales]]. Cuando ningún vector es combinación de los demás se tiene [[independencia-lineal]], y un conjunto independiente que genera todo el espacio es una [[base-y-dimension|base]]. El espacio generado es siempre uno de los [[subespacios]]. Resolver $\mathbf{A}\mathbf{x} = \mathbf{b}$ equivale a preguntar si $\mathbf{b}$ es combinación lineal de las columnas de $\mathbf{A}$, idea que se desarrolla en los [[sistemas-de-ecuaciones-lineales]]. En regresión, las predicciones de un modelo lineal son combinaciones lineales de las columnas de datos.

## Formulario

:::formula[Combinación lineal]
$$
\mathbf{x} = c_1\mathbf{v}_1 + c_2\mathbf{v}_2 + \dots + c_k\mathbf{v}_k
$$

- $\mathbf{x}$: vector resultante.
- $c_i$: coeficiente real del vector $\mathbf{v}_i$.
- $k$: número de vectores combinados.
:::

:::formula[Espacio generado]
$$
\operatorname{gen}\{\mathbf{v}_1, \dots, \mathbf{v}_k\} = \Big\{ \textstyle\sum_{i=1}^{k} c_i\mathbf{v}_i : c_i \in \mathbb{R} \Big\}
$$

- $\operatorname{gen}$: conjunto de todas las combinaciones lineales.
- $\mathbb{R}$: los coeficientes pueden ser cualquier número real.
:::

:::formula[Generar el plano con dos vectores]
$$
\operatorname{gen}\{\mathbf{u}, \mathbf{v}\} = \mathbb{R}^2 \iff u_1 v_2 - u_2 v_1 \neq 0
$$

- $\mathbf{u} = (u_1, u_2)$, $\mathbf{v} = (v_1, v_2)$: vectores del plano.
- $u_1 v_2 - u_2 v_1$: determinante de la matriz con columnas $\mathbf{u}$ y $\mathbf{v}$; es cero cuando son paralelos.
:::
