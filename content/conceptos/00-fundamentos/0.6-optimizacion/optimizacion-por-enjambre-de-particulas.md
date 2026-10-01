---
id: optimizacion-por-enjambre-de-particulas
titulo: Optimización por enjambre de partículas
titulo_en: Particle swarm optimization
alias:
  - PSO
  - enjambre de partículas
modulo: 0
submodulo: '0.6'
orden: 22
nivel: intermedio
prerrequisitos:
  - problema-de-optimizacion
etiquetas:
  - optimización global
  - población
  - inercia
  - mejor global
resumen: >
  En la optimización por enjambre, cada partícula se mueve con una velocidad que combina su inercia, la
  atracción hacia su mejor posición visitada y la atracción hacia la mejor posición del enjambre.
formula: '\mathbf{v}_{k+1} = w\,\mathbf{v}_k + c_1 r_1 (\mathbf{p} - \mathbf{x}_k) + c_2 r_2 (\mathbf{g} - \mathbf{x}_k), \qquad \mathbf{x}_{k+1} = \mathbf{x}_k + \mathbf{v}_{k+1}'
visualizacion:
  componente: OptimizerRace
  parametros:
    modo: poblacion
    metodo: enjambre
    funciones: [himmelblau, rastrigin]
referencias:
  - clave: murphy
publicado: true
---

## Intuición

Una parvada que busca alimento no tiene un plan central: cada ave recuerda dónde encontró más comida, ve hacia dónde va el resto y combina ambas cosas con la inercia de su propio vuelo. Con esas reglas sencillas, la parvada termina concentrada en el mejor sitio. La optimización por enjambre de partículas traduce esa idea: cada partícula es una solución candidata que vuela por el dominio.

La velocidad de cada partícula tiene tres componentes. La inercia la mantiene en la dirección en que venía. La memoria la jala hacia la mejor posición que ella misma ha visitado. La influencia social la jala hacia la mejor posición encontrada por todo el enjambre. Los jalones se multiplican por números aleatorios, así que las partículas no van en línea recta, sino que exploran alrededor del camino. Al principio el enjambre está disperso y explora; con el tiempo las partículas se reúnen alrededor del mejor punto y lo refinan.

## Definición

:::definicion[Enjambre de partículas]
Cada partícula $i$ tiene posición $\mathbf{x}_i$, velocidad $\mathbf{v}_i$ y mejor posición propia $\mathbf{p}_i$; el enjambre guarda su mejor posición global $\mathbf{g}$. En cada iteración, para cada coordenada:
$$
\mathbf{v}_i \leftarrow w\,\mathbf{v}_i + c_1 r_1\,(\mathbf{p}_i - \mathbf{x}_i) + c_2 r_2\,(\mathbf{g} - \mathbf{x}_i), \qquad \mathbf{x}_i \leftarrow \mathbf{x}_i + \mathbf{v}_i,
$$
con $r_1, r_2 \sim \mathcal{U}(0, 1)$ independientes. Después se actualizan $\mathbf{p}_i$, si $f(\mathbf{x}_i) < f(\mathbf{p}_i)$, y $\mathbf{g}$.
:::

Valores usuales: $w$ entre 0.4 y 0.9, $c_1 = c_2 \approx 1.5$. Con $w \ge 1$ las velocidades no se amortiguan y el enjambre no se reúne.

:::nota[Qué significa cada símbolo]
- $\mathbf{x}_i$: posición de la partícula $i$; $\mathbf{v}_i$: su velocidad.
- $\mathbf{p}_i$: mejor posición visitada por la partícula $i$.
- $\mathbf{g}$: mejor posición visitada por todo el enjambre.
- $w$: inercia, la fracción de la velocidad anterior que se conserva.
- $c_1$, $c_2$: pesos de la atracción hacia $\mathbf{p}_i$ y hacia $\mathbf{g}$.
- $r_1$, $r_2$: números aleatorios uniformes entre 0 y 1.
:::

## Cómo usar la visualización

Las curvas de nivel son las de la función elegida. Los 20 puntos azules son las partículas, cada una con una cola que indica su velocidad; el punto amarillo es la mejor posición global $\mathbf{g}$ y los círculos negros, los mínimos globales. El encabezado escribe en cada iteración $\mathbf{g}$, su valor y la dispersión del enjambre, la distancia típica de las partículas a $\mathbf{g}$. La inercia es $w = 0.7$ y $c_1 = c_2 = 1.5$.

En Himmelblau el enjambre empieza repartido, las colas apuntan hacia los mejores valles y en unas 30 iteraciones las partículas se reúnen en $(3, 2)$, con dispersión menor que 0.03 al final. Al cambiar a Rastrigin se observa cómo el enjambre cruza los huecos locales.

## Ejemplo

Una iteración para una partícula en $\mathbf{x} = (1, 1)$ con velocidad $\mathbf{v} = (0.5, -0.2)$, mejor propia $\mathbf{p} = (1.5, 1.2)$ y mejor global $\mathbf{g} = (3, 2)$; $w = 0.7$, $c_1 = c_2 = 1.5$ y, para simplificar, los mismos aleatorios en las dos coordenadas: $r_1 = 0.4$, $r_2 = 0.8$.

1. Inercia: $0.7\,(0.5, -0.2) = (0.35, -0.14)$.
2. Memoria: $1.5 \cdot 0.4\,\big((1.5, 1.2) - (1, 1)\big) = 0.6\,(0.5, 0.2) = (0.3, 0.12)$.
3. Influencia social: $1.5 \cdot 0.8\,\big((3, 2) - (1, 1)\big) = 1.2\,(2, 1) = (2.4, 1.2)$.
4. Nueva velocidad: $(0.35 + 0.3 + 2.4,\ -0.14 + 0.12 + 1.2) = (3.05, 1.18)$.
5. Nueva posición: $(1, 1) + (3.05, 1.18) = (4.05, 2.18)$. La partícula rebasa a $\mathbf{g}$; la inercia menor que 1 frenará ese vaivén en las siguientes iteraciones.

:::figura[Rastrigin con semilla 1: el enjambre explora los huecos, su dispersión baja de 3.7 a 0.09 en 60 iteraciones y la mejor posición global llega al mínimo (0, 0).]{componente="OptimizerRace"}
```yaml
modo: poblacion
metodo: enjambre
funciones: [rastrigin]
semilla: 1
```
:::

## Propiedades

- **Pocas reglas, pocos parámetros:** inercia y dos pesos; no necesita derivadas.
- **Exploración que se reduce:** con $w < 1$ la dispersión del enjambre disminuye con las iteraciones y la búsqueda pasa de explorar a refinar.
- **Memoria:** $\mathbf{g}$ nunca empeora, porque solo se reemplaza por una posición mejor.
- **Convergencia prematura:** si todas las partículas se reúnen pronto en un mínimo local, ya no salen de él.
- **Variantes:** con topologías locales cada partícula solo ve a sus vecinas, lo que mantiene más diversidad.

:::figura[Himmelblau con semilla 9: la dispersión del enjambre baja de 4.8 a 2.1 en 10 iteraciones, a 0.86 en 30 y a 0.03 en 60; las partículas se reúnen en el mínimo (3, 2).]{componente="OptimizerRace"}
```yaml
modo: poblacion
metodo: enjambre
funciones: [himmelblau]
semilla: 9
```
:::

## Errores comunes

- **Usar inercia mayor o igual que 1.** Las velocidades no se amortiguan, las partículas siguen volando y el enjambre no converge.
- **Interpretar la mejor posición global como el mínimo garantizado.** Es solo el mejor punto visitado.
- **Olvidar los límites del dominio.** Sin acotar las posiciones, las partículas con mucha velocidad salen de la región de interés.
- **Usar el mismo aleatorio para todas las coordenadas.** Las implementaciones estándar sortean $r_1$ y $r_2$ por coordenada; con uno solo, el enjambre explora menos direcciones.

:::figura[Himmelblau con inercia 1: tras 60 iteraciones las partículas siguen dispersas, con dispersión 2.4 en lugar de 0.03, porque las velocidades no se frenan.]{componente="OptimizerRace"}
```yaml
modo: poblacion
metodo: enjambre
funciones: [himmelblau]
semilla: 1
inercia: 1
```
:::

## Conexiones

Resuelve el [[problema-de-optimizacion]] con una población, como los [[algoritmos-geneticos]], pero las partículas se mueven en lugar de reproducirse. Su término de inercia recuerda al momento del [[descenso-de-gradiente]], aquí sin gradiente. El [[recocido-simulado]] y el [[metodo-de-nelder-mead]] son otras búsquedas sin derivadas.

## Formulario

:::formula[Actualización de la velocidad]
$$
\mathbf{v}_i \leftarrow w\,\mathbf{v}_i + c_1 r_1\,(\mathbf{p}_i - \mathbf{x}_i) + c_2 r_2\,(\mathbf{g} - \mathbf{x}_i)
$$

- $w$: inercia; $c_1$, $c_2$: pesos de atracción; $r_1$, $r_2$: aleatorios uniformes en $[0, 1]$.
- $\mathbf{p}_i$: mejor posición propia; $\mathbf{g}$: mejor posición global.
:::

:::formula[Actualización de la posición]
$$
\mathbf{x}_i \leftarrow \mathbf{x}_i + \mathbf{v}_i
$$

- $\mathbf{x}_i$: posición; $\mathbf{v}_i$: velocidad recién calculada.
:::

:::formula[Dispersión del enjambre]
$$
s = \sqrt{\frac{1}{m}\sum_{i=1}^{m} \lVert \mathbf{x}_i - \mathbf{g} \rVert^2}
$$

- $m$: número de partículas; $s$: distancia cuadrática media a la mejor posición global.
:::
