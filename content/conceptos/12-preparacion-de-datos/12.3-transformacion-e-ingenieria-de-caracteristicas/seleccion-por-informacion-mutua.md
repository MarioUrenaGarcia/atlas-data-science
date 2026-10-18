---
id: seleccion-por-informacion-mutua
titulo: Selección por información mutua
titulo_en: Mutual information feature selection
alias:
  - filtro por información mutua
  - mutual information feature selection
modulo: 12
submodulo: '12.3'
orden: 25
nivel: basico
prerrequisitos:
  - seleccion-de-caracteristicas-por-filtro
  - informacion-mutua-empirica
etiquetas:
  - selección de características
  - información mutua
  - dependencia no lineal
  - teoría de la información
resumen: >
  Usa la información mutua entre cada variable y la respuesta como puntaje de filtro. A diferencia de la
  correlación, detecta dependencias no lineales, como un óptimo intermedio, aunque es más difícil de estimar.
formula: 'I(X; Y) = \sum_{a,b} p_{ab}\log\frac{p_{ab}}{p_a\,p_b}'
visualizacion:
  componente: FeatureSelectionViz
  parametros:
    modo: informacion
    variable: 3
referencias:
  - clave: cover-thomas
  - clave: murphy
publicado: true
---

## Intuición

El rendimiento de un cultivo es máximo con temperaturas intermedias y baja tanto con frío como con calor. Esa relación es fuerte, pero tiene forma de U invertida: cuando la temperatura sube desde valores bajos el rendimiento aumenta y, pasado el óptimo, disminuye. La correlación de Pearson, que mide tendencia lineal, promedia ambas mitades y da casi cero. Un filtro por correlación descartaría la temperatura.

La **información mutua** responde otra pregunta: ¿cuánto se reduce la incertidumbre sobre el rendimiento al conocer la temperatura? No importa la forma de la relación; importa que saber una variable cambie la distribución de la otra. Si la temperatura es intermedia, el rendimiento suele ser alto; si es extrema, suele ser bajo: hay información, aunque no haya tendencia. Usada como puntaje de filtro, la información mutua rescata variables con efectos no lineales. Su costo es la estimación: con pocos datos y muchos intervalos, incluso variables sin relación muestran algo de información mutua por azar.

## Definición

:::definicion[Información mutua y selección]
Para variables discretas $X$ y $Y$, con probabilidades conjuntas $p_{ab} = P(X = a, Y = b)$ y marginales $p_a$, $p_b$, la **información mutua** es

$$
I(X; Y) = \sum_{a,b} p_{ab}\log\frac{p_{ab}}{p_a\,p_b} \ \ge 0,
$$

y vale $0$ si y solo si $X$ y $Y$ son independientes. Para variables continuas se estima discretizando cada una en intervalos y usando las frecuencias relativas $\hat{p}_{ab}$, $\hat{p}_a$, $\hat{p}_b$. La **selección por información mutua** conserva las $k$ variables con mayor $\hat{I}(X_j; Y)$.
:::

:::nota[Qué significa cada símbolo]
- $X$, $Y$: variable candidata y respuesta (discretizadas).
- $a$, $b$: intervalo o categoría de $X$ y de $Y$.
- $p_{ab}$: probabilidad de que $X$ caiga en $a$ y $Y$ en $b$.
- $p_a$, $p_b$: probabilidades marginales.
- $\log$: logaritmo natural; la información se mide en nats.
- $I(X; Y)$: información mutua.
- $\hat{p}$, $\hat{I}$: estimaciones con frecuencias de la muestra.
- $k$: número de variables conservadas.
:::

## Cómo usar la visualización

Para cada variable se calculan dos puntajes, uno por uno: la información mutua estimada con 6 intervalos por eje (barras superiores) y la correlación absoluta (barras inferiores). La variable elegida en el selector se resalta y se dibuja contra el rendimiento a la derecha. El encabezado muestra la fórmula con el valor de la variable en curso.

Experimentos sugeridos: elegir la temperatura y observar la nube en forma de arco con correlación casi nula e información mutua alta; elegir un código administrativo y ver que su información mutua es pequeña pero no cero.

## Ejemplo

Se discretizan la temperatura y el rendimiento en "bajo" y "alto". Supongamos que la tabla de frecuencias relativas es:

| | Rendimiento bajo | Rendimiento alto |
| --- | --- | --- |
| Temperatura extrema | 0.40 | 0.10 |
| Temperatura intermedia | 0.10 | 0.40 |

1. Marginales: $p_a = 0.5$ para cada fila y $p_b = 0.5$ para cada columna, así que $p_a p_b = 0.25$.
2. Términos de la diagonal: $2 \times 0.40\log(0.40/0.25) = 0.8 \times 0.470 = 0.376$.
3. Términos fuera de la diagonal: $2 \times 0.10\log(0.10/0.25) = 0.2 \times (-0.916) = -0.183$.
4. $I = 0.376 - 0.183 = 0.193$ nats.
5. Si la temperatura se usa como número, las frías y las calientes, ambas de rendimiento bajo, quedan en lados opuestos de las intermedias, y la correlación con el rendimiento puede ser casi nula aunque la tabla muestre una dependencia clara.

:::figura[El fertilizante, con efecto lineal: tanto la correlación como la información mutua lo detectan.]{componente="FeatureSelectionViz"}
```yaml
modo: informacion
variable: 1
```
:::

## Propiedades

- **Es cero solo con independencia.** Cualquier dependencia, lineal o no, produce información mutua positiva.
- **Es invariante a transformaciones uno a uno.** Cambiar la escala o aplicar un logaritmo a la variable no cambia su información mutua.
- **Su estimación tiene sesgo positivo.** Con $n$ datos y $B$ intervalos por eje, variables independientes muestran en promedio cerca de $(B - 1)^2/(2n)$ nats.

:::figura[Un código administrativo sin relación con el rendimiento: su información mutua estimada es pequeña pero positiva, por el sesgo de la estimación con 400 parcelas.]{componente="FeatureSelectionViz"}
```yaml
modo: informacion
variable: 6
```
:::

## Errores comunes

- **Comparar puntajes estimados con distinto número de intervalos o de datos.** El sesgo depende de ambos; los puntajes solo se comparan bajo la misma estimación.
- **Usar muchos intervalos con pocos datos.** Las celdas quedan casi vacías y la información mutua estimada crece aunque no haya relación.
- **Olvidar la redundancia.** Igual que con la correlación, la lluvia y su copia por satélite reciben puntajes altos ambas; el filtro por información mutua no detecta que repiten información.

:::figura[Error de olvidar la redundancia: la lluvia por satélite tiene información mutua casi tan alta como la lluvia, aunque no agrega nada nuevo.]{componente="FeatureSelectionViz"}
```yaml
modo: informacion
variable: 4
```
:::

## Conexiones

Es un caso de [[seleccion-de-caracteristicas-por-filtro]] con el puntaje de la [[informacion-mutua-empirica]]. La discretización necesaria se hace con la [[discretizacion]] por igual frecuencia. Su ventaja sobre el [[coeficiente-de-correlacion-de-pearson]] es la que ilustra la [[correlacion-de-distancia]]: medir dependencia general y no solo lineal. La independencia que mide es la de [[independencia-de-eventos]] aplicada a todas las combinaciones de valores.

## Formulario

:::formula[Información mutua]
$$
I(X; Y) = \sum_{a,b} p_{ab}\log\frac{p_{ab}}{p_a\,p_b}
$$

- $p_{ab}$: probabilidad conjunta; $p_a$, $p_b$: marginales.
- Se mide en nats con el logaritmo natural.
:::

:::formula[Sesgo aproximado bajo independencia]
$$
\mathbb{E}[\hat{I}] \approx \frac{(B - 1)^2}{2n}
$$

- $B$: intervalos por eje; $n$: número de observaciones.
:::
