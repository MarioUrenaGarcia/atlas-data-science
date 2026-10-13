---
id: recocido-simulado
titulo: Recocido simulado
titulo_en: Simulated annealing
alias:
  - templado simulado
  - simulated annealing
modulo: 0
submodulo: '0.6'
orden: 20
nivel: intermedio
prerrequisitos:
  - problema-de-optimizacion
etiquetas:
  - optimización global
  - temperatura
  - búsqueda aleatoria
  - criterio de Metropolis
resumen: >
  El recocido simulado explora al azar y acepta siempre los movimientos que mejoran y, con probabilidad
  exp(-Δ/T), los que empeoran; al bajar la temperatura T se vuelve cada vez más exigente.
formula: 'P(\text{aceptar}) = \begin{cases} 1 & \Delta \le 0 \\ e^{-\Delta / T} & \Delta > 0 \end{cases}, \qquad T_{k+1} = \alpha\,T_k'
visualizacion:
  componente: OptimizerRace
  parametros:
    modo: poblacion
    metodo: recocido
    funciones: [rastrigin, himmelblau]
    inicio: [-3, 2]
    semilla: 4
referencias:
  - clave: murphy
publicado: true
---

## Intuición

Al fabricar acero se calienta el metal y se enfría despacio: con el calor los átomos se mueven con libertad y, al enfriarse poco a poco, se acomodan en una estructura ordenada de baja energía. Si se enfría de golpe, quedan atrapados en un arreglo desordenado. El recocido simulado imita ese proceso para minimizar funciones con muchos mínimos locales.

Desde el punto actual se propone un vecino al azar. Si es mejor, se acepta. Si es peor, se acepta a veces, con una probabilidad que depende de cuánto empeora y de la temperatura. Al principio, con temperatura alta, se aceptan muchas subidas y la búsqueda puede salir de un hueco y cruzar colinas. Conforme la temperatura baja, las subidas se vuelven raras y la búsqueda se asienta en el fondo del valle donde se encuentre. La clave es enfriar lo bastante despacio para que, antes de congelarse, la búsqueda haya tenido oportunidad de visitar los mejores valles.

## Definición

:::definicion[Recocido simulado]
Desde $\mathbf{x}_0$ y una temperatura inicial $T_0$, en cada paso $k$:

1. Se propone un vecino $\mathbf{y} = \mathbf{x}_k + \boldsymbol{\varepsilon}$, con $\boldsymbol{\varepsilon}$ aleatorio, por ejemplo normal.
2. Se calcula $\Delta = f(\mathbf{y}) - f(\mathbf{x}_k)$.
3. Se acepta $\mathbf{x}_{k+1} = \mathbf{y}$ con probabilidad $\min(1,\ e^{-\Delta / T_k})$; si no, $\mathbf{x}_{k+1} = \mathbf{x}_k$.
4. Se enfría: $T_{k+1} = \alpha\,T_k$, con $0 < \alpha < 1$.

Se guarda el mejor punto visitado.
:::

La regla de aceptación es el criterio de Metropolis. Con un enfriamiento logarítmico, $T_k = c/\log(k + 2)$ y $c$ suficientemente grande, la búsqueda converge en probabilidad al mínimo global, pero ese enfriamiento es demasiado lento para la práctica; el geométrico es el más usado.

:::nota[Qué significa cada símbolo]
- $\mathbf{x}_k$: punto actual en el paso $k$; $\mathbf{y}$: vecino propuesto.
- $\boldsymbol{\varepsilon}$: perturbación aleatoria que define el vecino.
- $\Delta$: cambio en el valor de $f$; positivo si el vecino es peor.
- $T_k$: temperatura en el paso $k$; $T_0$: temperatura inicial.
- $\alpha$: factor de enfriamiento por paso.
- $e^{-\Delta/T}$: probabilidad de aceptar un empeoramiento.
:::

## Cómo usar la visualización

Las curvas de nivel son las de la función elegida. La línea azul es el recorrido aceptado; el punto de prueba aparece verde si se acepta y naranja si se rechaza. El punto amarillo es el mejor encontrado y los círculos negros, los mínimos globales. El encabezado escribe en cada paso la temperatura $T$, el cambio $\Delta$, la probabilidad de aceptar y la decisión. La temperatura empieza en 10 y se multiplica por 0.98 en cada paso.

En Rastrigin, desde $(-3, 2)$, al principio el recorrido salta entre huecos vecinos, incluso cuesta arriba; al enfriarse se queda quieto en el fondo de uno. Con esta semilla termina cerca de $(0, 0)$, el mínimo global, con $f = 0.021$. Con otras semillas puede terminar en un hueco vecino.

## Ejemplo

Un vecino empeora la función en $\Delta = 2$. Se compara la probabilidad de aceptarlo a dos temperaturas.

1. Con $T = 5$: $P = e^{-2/5} = e^{-0.4} = 0.670$. Dos de cada tres veces se acepta la subida.
2. Con $T = 0.5$: $P = e^{-2/0.5} = e^{-4} = 0.018$. Casi nunca se acepta.
3. Un vecino que mejora, $\Delta = -1$, se acepta siempre, a cualquier temperatura.
4. Con $T_0 = 10$ y $\alpha = 0.98$, la temperatura pasa de 10 a $10 \cdot 0.98^{100} = 1.33$ en 100 pasos y a $0.024$ en 300.
5. En la visualización con esta semilla, de los primeros 100 candidatos se aceptan 15, ocho de ellos cuesta arriba; de los últimos 100 se aceptan 2, ninguno cuesta arriba.

:::figura[Rastrigin desde (-3, 2) con semilla 4: mientras la temperatura es alta el recorrido acepta subidas y cruza de un hueco a otro; al enfriarse se queda en el mínimo global, con f = 0.021.]{componente="OptimizerRace"}
```yaml
modo: poblacion
metodo: recocido
funciones: [rastrigin]
inicio: [-3, 2]
semilla: 4
```
:::

## Propiedades

- **Exploración y explotación:** la temperatura regula el equilibrio entre explorar, aceptando subidas, y refinar, aceptando solo mejoras.
- **Sin derivadas:** solo evalúa la función; sirve para problemas discretos como el del agente viajero.
- **Convergencia teórica:** con enfriamiento logarítmico suficientemente lento converge al mínimo global con probabilidad que tiende a 1.
- **Relación con cadenas de Markov:** a temperatura fija, el recorrido es una cadena de Markov cuya distribución estacionaria es proporcional a $e^{-f(\mathbf{x})/T}$; al bajar $T$ se concentra en los mínimos globales.
- **Escala de la función:** lo que importa es $\Delta/T$; si se multiplica $f$ por 10, hay que multiplicar también la temperatura.

:::figura[En Himmelblau, desde (-4, -4) con semilla 11, el recorrido llega a (-3.76, -3.25), con f = 0.063, junto al mínimo más cercano (-3.78, -3.28); con temperatura baja la búsqueda refina dentro de un valle.]{componente="OptimizerRace"}
```yaml
modo: poblacion
metodo: recocido
funciones: [himmelblau]
inicio: [-4, -4]
semilla: 11
```
:::

## Errores comunes

- **Enfriar demasiado rápido.** La búsqueda se congela antes de explorar y queda atrapada como un descenso local.
- **Aceptar solo mejoras.** Sin aceptar subidas el método se reduce a una búsqueda local aleatoria.
- **Reportar el último punto en lugar del mejor.** El recorrido puede alejarse del mejor punto visitado; se guarda aparte.
- **Ignorar la escala de $f$.** Una temperatura inicial pensada para diferencias de 1 no sirve si la función cambia en miles.

:::figura[La misma búsqueda con enfriamiento 0.9 en lugar de 0.98: la temperatura cae a casi cero en 50 pasos, el recorrido se congela en el hueco (-1, 0) y termina con f = 1.01 en lugar de 0.021.]{componente="OptimizerRace"}
```yaml
modo: poblacion
metodo: recocido
funciones: [rastrigin]
inicio: [-3, 2]
semilla: 4
enfriamiento: 0.9
```
:::

## Conexiones

Resuelve el [[problema-de-optimizacion]] buscando el mínimo global, a diferencia del [[descenso-de-gradiente]] y de [[metodo-de-nelder-mead]], que son locales. Como los [[algoritmos-geneticos]] y la [[optimizacion-por-enjambre-de-particulas]], usa aleatoriedad para escapar de mínimos locales. Su regla de aceptación es la misma del algoritmo de Metropolis que se estudia con las cadenas de Markov.

## Formulario

:::formula[Probabilidad de aceptación]
$$
P(\text{aceptar}) = \min\big(1,\ e^{-\Delta / T}\big), \qquad \Delta = f(\mathbf{y}) - f(\mathbf{x})
$$

- $\mathbf{y}$: vecino propuesto; $\mathbf{x}$: punto actual; $T$: temperatura.
:::

:::formula[Enfriamiento geométrico]
$$
T_k = T_0\,\alpha^k
$$

- $T_0$: temperatura inicial; $\alpha \in (0, 1)$: factor de enfriamiento; $k$: número de paso.
:::

:::formula[Enfriamiento logarítmico]
$$
T_k = \frac{c}{\log(k + 2)}
$$

- $c$: constante positiva suficientemente grande; garantiza convergencia al mínimo global, pero muy despacio.
:::

:::formula[Distribución a temperatura fija]
$$
\pi_T(\mathbf{x}) \propto e^{-f(\mathbf{x}) / T}
$$

- $\pi_T$: distribución estacionaria del recorrido a temperatura $T$; $\propto$: proporcional a.
:::
