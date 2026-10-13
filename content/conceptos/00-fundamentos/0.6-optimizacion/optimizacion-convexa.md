---
id: optimizacion-convexa
titulo: Optimización convexa
titulo_en: Convex optimization
alias:
  - problema convexo
  - programación convexa
modulo: 0
submodulo: '0.6'
orden: 4
nivel: intermedio
prerrequisitos:
  - conjuntos-convexos
  - funciones-convexas-y-concavas
  - condiciones-de-optimalidad-de-primer-y-segundo-orden
etiquetas:
  - convexidad
  - mínimo global
  - optimización
  - garantías
resumen: >
  Un problema es convexo si minimiza una función convexa sobre un conjunto convexo; entonces todo mínimo local
  es global y los métodos locales encuentran la solución desde cualquier punto de partida.
formula: '\min_{\mathbf{x} \in C} f(\mathbf{x}),\ f \text{ y } C \text{ convexos} \ \Rightarrow\ \text{mínimo local} = \text{mínimo global}'
visualizacion:
  componente: OptimizerRace
  parametros:
    modo: inicios
    funciones: [girada, himmelblau]
referencias:
  - clave: boyd
    capitulo: '4'
publicado: true
---

## Intuición

Un tazón tiene un solo fondo: una canica soltada en cualquier punto rueda hasta el mismo lugar. Un paisaje de montaña tiene muchos valles, y una canica se queda en el valle donde cayó, sin saber si hay otro más profundo detrás de la colina. La optimización convexa estudia los problemas del primer tipo: aquellos donde no hay valles falsos.

La condición es doble: la función objetivo debe ser convexa, curvada hacia arriba como un tazón, y la región factible debe ser un conjunto convexo, sin entrantes que escondan partes del tazón. Cuando ambas se cumplen, cualquier punto donde ya no se pueda mejorar localmente es el mejor de todos. Por eso los problemas convexos se resuelven con confianza: regresión lineal y logística, regresión con penalización, máquinas de vectores de soporte y muchos problemas de asignación son convexos, y sus soluciones son únicas o forman un conjunto convexo.

## Definición

:::definicion[Problema convexo]
El problema $\min f(\mathbf{x})$ sujeto a $g_i(\mathbf{x}) \le 0$ y $h_j(\mathbf{x}) = 0$ es **convexo** si $f$ y las $g_i$ son funciones convexas y las $h_j$ son afines, $h_j(\mathbf{x}) = \mathbf{a}_j^\top \mathbf{x} - b_j$. Su región factible es entonces un conjunto convexo.
:::

Una función $f$ es convexa si $f(\lambda\mathbf{x} + (1 - \lambda)\mathbf{y}) \le \lambda f(\mathbf{x}) + (1 - \lambda) f(\mathbf{y})$ para todo $\lambda \in [0, 1]$; si $f$ es dos veces diferenciable, equivale a que $\mathbf{H}_f(\mathbf{x}) \succeq 0$ en todo punto.

:::teorema[Local es global]
En un problema convexo todo mínimo local es global. Si además $f$ es estrictamente convexa, el mínimo, si existe, es único.
:::

:::nota[Qué significa cada símbolo]
- $f$: función objetivo convexa.
- $g_i$: restricciones de desigualdad, convexas.
- $h_j$: restricciones de igualdad, afines; $\mathbf{a}_j$ y $b_j$ son sus coeficientes.
- $C$: región factible, convexa.
- $\lambda$: peso entre 0 y 1.
- $\mathbf{H}_f \succeq 0$: hessiana semidefinida positiva.
:::

## Cómo usar la visualización

Se sueltan dieciséis puntos de partida en una rejilla y desde cada uno corre el descenso de gradiente con una tasa fija, segura para toda la ventana. Cada camino se colorea según el punto donde termina. El panel cuenta cuántos puntos finales distintos hay y cuántos caminos llegan a cada uno. El selector cambia la función.

Con la cuadrática girada, que es convexa, los dieciséis caminos terminan en el mismo punto. Con la función de Himmelblau, que no es convexa, se reparten entre cuatro mínimos distintos según la cuenca de partida.

## Ejemplo

Se estudia la función $f(x, y) = \tfrac{1}{2}(3x^2 + 4xy + 3y^2) - x + y$ sobre todo el plano.

1. Hessiana: $\mathbf{H} = \begin{pmatrix} 3 & 2 \\ 2 & 3 \end{pmatrix}$, constante.
2. Valores propios: $3 + 2 = 5$ y $3 - 2 = 1$, ambos positivos; $\mathbf{H} \succ 0$ y $f$ es estrictamente convexa.
3. Condición de primer orden: $3x + 2y = 1$ y $2x + 3y = -1$; la solución es $(1, -1)$.
4. Por convexidad, $(1, -1)$ es el mínimo global y es único, con $f(1, -1) = \tfrac{1}{2}(3 - 4 + 3) - 1 - 1 = -1$.
5. Cualquier método de descenso que converja a un punto con gradiente cero llega a $(1, -1)$, sin importar dónde empiece.

:::figura[La cuadrática convexa del ejemplo: dieciséis puntos de partida y un solo punto final, el mínimo global (1, -1).]{componente="OptimizerRace"}
```yaml
modo: inicios
funciones: [girada]
```
:::

## Propiedades

- **Condición de primer orden suficiente:** si $f$ es convexa y diferenciable, $\nabla f(\mathbf{x}^*) = \mathbf{0}$ implica que $\mathbf{x}^*$ es mínimo global.
- **Operaciones que preservan convexidad:** sumas con pesos no negativos, composición con funciones afines y máximo puntual de funciones convexas.
- **Conjunto de soluciones:** el conjunto de minimizadores de un problema convexo es convexo.
- **Restricciones convexas:** agregar una restricción convexa mantiene el problema convexo; su solución puede quedar en la frontera, pero sigue siendo única si $f$ es estrictamente convexa.
- **Algoritmos:** gradiente, Newton y métodos de punto interior tienen garantías de convergencia al óptimo en problemas convexos.

:::figura[Un problema convexo con restricción: la misma cuadrática con x ≥ 1.5 tiene un único óptimo en la frontera, (1.5, -1.33), y el descenso proyectado lo alcanza.]{componente="OptimizerRace"}
```yaml
modo: restricciones
funciones: [girada]
restricciones:
  - a: [-1, 0]
    c: -1.5
    etiqueta: 'x \ge 1.5'
inicio: [-2, -2]
tasa: 0.15
```
:::

## Errores comunes

- **Creer que el descenso de gradiente siempre encuentra el mínimo global.** Solo está garantizado en problemas convexos; en los demás se detiene en el mínimo local de la cuenca donde empieza.
- **Revisar solo la función objetivo.** Un objetivo convexo sobre una región no convexa puede tener mínimos locales que no son globales.
- **Confundir convexo con "fácil de escribir".** $x^4 - x^2$ es un polinomio sencillo y no es convexo.
- **Suponer unicidad sin convexidad estricta.** $f(x, y) = x^2$ es convexa y tiene infinitos minimizadores, toda la recta $x = 0$.

:::figura[La función de Himmelblau no es convexa: los caminos que empiezan en distintas cuencas terminan en cuatro mínimos distintos, todos con valor 0.]{componente="OptimizerRace"}
```yaml
modo: inicios
funciones: [himmelblau]
```
:::

## Conexiones

Combina [[conjuntos-convexos]] y [[funciones-convexas-y-concavas]], y simplifica las [[condiciones-de-optimalidad-de-primer-y-segundo-orden]]. La convexidad se verifica con la [[matriz-hessiana]] y las [[matrices-definidas-positivas-y-semidefinidas]]. Son convexas la [[programacion-lineal]], la [[programacion-cuadratica]] con matriz semidefinida positiva y los problemas de los [[metodos-proximales-y-gradiente-proximal]]. El [[descenso-de-gradiente]] tiene garantías de convergencia en ellos.

## Formulario

:::formula[Función convexa]
$$
f(\lambda\mathbf{x} + (1 - \lambda)\mathbf{y}) \le \lambda f(\mathbf{x}) + (1 - \lambda) f(\mathbf{y}), \quad \lambda \in [0, 1]
$$

- $\mathbf{x}, \mathbf{y}$: puntos del dominio; $\lambda$: peso.
:::

:::formula[Criterio con la hessiana]
$$
f \text{ convexa} \iff \mathbf{H}_f(\mathbf{x}) \succeq 0 \ \text{para todo } \mathbf{x}
$$

- Para $f$ dos veces diferenciable en un dominio convexo.
:::

:::formula[Problema convexo]
$$
\min f(\mathbf{x}) \ \text{s. a.} \ g_i(\mathbf{x}) \le 0,\ \mathbf{a}_j^\top \mathbf{x} = b_j
$$

- $f$, $g_i$: convexas; restricciones de igualdad afines.
:::

:::formula[Optimalidad en el caso diferenciable sin restricciones]
$$
\nabla f(\mathbf{x}^*) = \mathbf{0} \ \Rightarrow\ f(\mathbf{x}^*) \le f(\mathbf{x}) \ \text{para todo } \mathbf{x}
$$

- Válido si $f$ es convexa.
:::
