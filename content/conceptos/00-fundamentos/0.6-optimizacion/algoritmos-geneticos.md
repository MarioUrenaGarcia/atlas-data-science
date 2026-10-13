---
id: algoritmos-geneticos
titulo: Algoritmos genéticos
titulo_en: Genetic algorithms
alias:
  - algoritmo genético
  - computación evolutiva
  - algoritmos evolutivos
modulo: 0
submodulo: '0.6'
orden: 21
nivel: intermedio
prerrequisitos:
  - problema-de-optimizacion
etiquetas:
  - optimización global
  - población
  - selección
  - mutación
resumen: >
  Un algoritmo genético mantiene una población de soluciones que se reproduce: selecciona a las mejores,
  las cruza para formar hijos y los muta al azar, de modo que la población mejora generación tras generación.
formula: '\mathbf{h} = w\,\mathbf{p} + (1 - w)\,\mathbf{q} + \boldsymbol{\varepsilon}, \qquad w \sim \mathcal{U}(0, 1),\quad \boldsymbol{\varepsilon} \sim \mathcal{N}(\mathbf{0}, \sigma^2 \mathbf{I})'
visualizacion:
  componente: OptimizerRace
  parametros:
    modo: poblacion
    metodo: genetico
    funciones: [rastrigin, himmelblau]
referencias:
  - clave: murphy
publicado: true
---

## Intuición

En la selección natural, los individuos mejor adaptados tienen más descendencia, los hijos combinan rasgos de sus padres y las mutaciones introducen variaciones nuevas. Sin que nadie diseñe nada, la población se adapta con las generaciones. Un algoritmo genético usa ese mecanismo para optimizar: cada individuo es una solución candidata y su aptitud es el valor de la función objetivo.

Se empieza con una población dispersa al azar por todo el dominio. En cada generación se eligen padres favoreciendo a los mejores, se combinan para formar hijos parecidos a ambos y a cada hijo se le aplica una pequeña perturbación aleatoria. Como la población cubre muchas regiones a la vez, el método puede encontrar el valle del mínimo global aunque haya muchos mínimos locales. La mutación mantiene la diversidad: sin ella, la población se vuelve una sola copia repetida y deja de explorar.

## Definición

:::definicion[Algoritmo genético con codificación real]
Se mantiene una población $\{\mathbf{x}_1, \dots, \mathbf{x}_m\}$. En cada generación:

1. **Elitismo:** el mejor individuo pasa sin cambios a la siguiente generación.
2. **Selección por torneo:** para elegir un padre se toman dos individuos al azar y gana el de menor $f$.
3. **Cruce:** con padres $\mathbf{p}$ y $\mathbf{q}$ y un peso $w \sim \mathcal{U}(0, 1)$, el hijo es $w\,\mathbf{p} + (1 - w)\,\mathbf{q}$.
4. **Mutación:** se suma una perturbación $\boldsymbol{\varepsilon} \sim \mathcal{N}(\mathbf{0}, \sigma^2 \mathbf{I})$.

Se repite hasta completar $m$ individuos y se pasa a la siguiente generación.
:::

Hay muchas variantes: codificación binaria, selección proporcional a la aptitud, cruces por puntos de corte. Todas comparten selección, recombinación y mutación.

:::nota[Qué significa cada símbolo]
- $\mathbf{x}_i$: individuo $i$, una solución candidata; $m$: tamaño de la población.
- $f$: función objetivo; menor $f$ significa mayor aptitud.
- $\mathbf{p}$, $\mathbf{q}$: padres; $\mathbf{h}$: hijo.
- $w$: peso aleatorio del cruce, uniforme entre 0 y 1.
- $\boldsymbol{\varepsilon}$: mutación normal con desviación $\sigma$ en cada coordenada.
- $\mathbf{I}$: matriz identidad.
:::

## Cómo usar la visualización

Las curvas de nivel son las de la función elegida. Los puntos azules son los 30 individuos de la generación actual, el amarillo es el mejor y los círculos negros, los mínimos globales. El encabezado escribe la generación, el valor del mejor individuo y el promedio de la población. La mutación tiene desviación igual al 4 % del ancho de la ventana.

En Rastrigin, la población empieza repartida por todo el cuadrado y en pocas generaciones se concentra en los huecos centrales; al final el mejor individuo está cerca de $(0, 0)$. Observar cómo el promedio de $f$ baja mucho más despacio que el mejor valor: la mutación mantiene individuos que siguen explorando.

## Ejemplo

Se forma un hijo a partir de los padres $\mathbf{p} = (1, 2)$ y $\mathbf{q} = (3, -1)$, ganadores de dos torneos.

1. Torneos: entre $(1, 2)$ y otro individuo con mayor $f$ gana $(1, 2)$; lo mismo para $(3, -1)$.
2. Peso del cruce: $w = 0.3$.
3. Cruce: $0.3\,(1, 2) + 0.7\,(3, -1) = (0.3 + 2.1,\ 0.6 - 0.7) = (2.4,\ -0.1)$. El hijo queda sobre el segmento entre los padres, más cerca de $\mathbf{q}$.
4. Mutación con $\sigma = 0.4$: si $\boldsymbol{\varepsilon} = (0.15, -0.3)$, el hijo final es $(2.55, -0.4)$.
5. Se repite hasta tener 29 hijos, que junto con el mejor individuo forman la nueva generación.

:::figura[Himmelblau con semilla 5: la población inicial cubre el cuadrado, se concentra en los valles de los mínimos y el mejor individuo termina en (3.58, -1.84), con f = 0.0009, junto al mínimo (3.58, -1.85).]{componente="OptimizerRace"}
```yaml
modo: poblacion
metodo: genetico
funciones: [himmelblau]
semilla: 5
```
:::

## Propiedades

- **Elitismo:** con elitismo el mejor valor de la población nunca empeora de una generación a la siguiente.
- **Búsqueda global:** al mantener individuos en muchas regiones, puede escapar de mínimos locales.
- **Sin derivadas ni continuidad:** sirve para funciones discontinuas, ruidosas o definidas sobre objetos discretos.
- **Costo:** cada generación evalúa la función $m$ veces; suelen necesitar muchas más evaluaciones que un método con gradiente.
- **Sin garantía de optimalidad:** no hay un criterio que certifique que se encontró el mínimo global.

:::figura[Elitismo en Rastrigin con semilla 2: el mejor valor baja de 5.61 a 1.19 en cinco generaciones, a 0.43 en veinte y a 0.088 en cuarenta, sin subir nunca, mientras el promedio de la población sigue alto.]{componente="OptimizerRace"}
```yaml
modo: poblacion
metodo: genetico
funciones: [rastrigin]
semilla: 2
```
:::

## Errores comunes

- **Mutación demasiado pequeña.** La población se vuelve homogénea en pocas generaciones y converge prematuramente a un mínimo local.
- **Mutación demasiado grande.** Los hijos dejan de parecerse a los padres y el método se vuelve una búsqueda al azar.
- **Interpretar la analogía biológica como garantía.** La evolución no optimiza una función fija; el algoritmo es una heurística sin garantía de encontrar el óptimo.
- **Comparar con pocas evaluaciones.** Un algoritmo genético con 30 individuos y 40 generaciones usa unas 1200 evaluaciones; la comparación justa con otro método es con el mismo presupuesto.

:::figura[La misma población de Rastrigin con mutación de 0.1 % del ancho: los individuos se agrupan en un solo hueco y el mejor se queda en (0, 0.995), un mínimo local con f = 0.995; el promedio de la población, 1.02, muestra que ya no hay diversidad.]{componente="OptimizerRace"}
```yaml
modo: poblacion
metodo: genetico
funciones: [rastrigin]
semilla: 2
mutacion: 0.001
```
:::

## Conexiones

Resuelve el [[problema-de-optimizacion]] buscando el mínimo global con una población, como la [[optimizacion-por-enjambre-de-particulas]]. El [[recocido-simulado]] usa un solo punto con aceptación aleatoria y el [[metodo-de-nelder-mead]] un triángulo determinista. Cuando hay varios objetivos, las variantes evolutivas aproximan el frente de la [[optimizacion-multiobjetivo-y-frente-de-pareto]].

## Formulario

:::formula[Cruce aritmético]
$$
\mathbf{h} = w\,\mathbf{p} + (1 - w)\,\mathbf{q}, \qquad w \sim \mathcal{U}(0, 1)
$$

- $\mathbf{p}$, $\mathbf{q}$: padres; $\mathbf{h}$: hijo; $w$: peso aleatorio.
:::

:::formula[Mutación gaussiana]
$$
\mathbf{h} \leftarrow \mathbf{h} + \boldsymbol{\varepsilon}, \qquad \boldsymbol{\varepsilon} \sim \mathcal{N}(\mathbf{0}, \sigma^2 \mathbf{I})
$$

- $\sigma$: escala de la mutación; $\mathbf{I}$: identidad.
:::

:::formula[Torneo de tamaño dos]
$$
\text{padre} = \arg\min\big(f(\mathbf{x}_a),\ f(\mathbf{x}_b)\big)
$$

- $\mathbf{x}_a$, $\mathbf{x}_b$: individuos elegidos al azar de la población.
:::

:::formula[Evaluaciones totales]
$$
\text{evaluaciones} = m \times G
$$

- $m$: tamaño de la población; $G$: número de generaciones.
:::
