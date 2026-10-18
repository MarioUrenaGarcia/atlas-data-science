---
id: eliminacion-recursiva-de-caracteristicas
titulo: Eliminación recursiva de características (RFE)
titulo_en: Recursive feature elimination (RFE)
alias:
  - RFE
  - eliminación hacia atrás
  - recursive feature elimination
modulo: 12
submodulo: '12.3'
orden: 26
nivel: basico
prerrequisitos:
  - seleccion-de-caracteristicas-por-envoltura
  - estandarizacion
etiquetas:
  - selección de características
  - eliminación hacia atrás
  - coeficientes
  - validación
resumen: >
  La eliminación recursiva ajusta el modelo con todas las variables, quita la de menor importancia (por ejemplo,
  el menor coeficiente estandarizado), vuelve a ajustar y repite; el error de validación indica cuántas conservar.
formula: 'S_{t+1} = S_t \setminus \{\arg\min_{j \in S_t} |\hat{\beta}_j(S_t)|\}'
visualizacion:
  componente: FeatureSelectionViz
  parametros:
    modo: rfe
referencias:
  - clave: hastie-esl
  - clave: molnar
publicado: true
---

## Intuición

La selección hacia adelante construye el modelo agregando variables; la **eliminación recursiva** hace lo contrario: empieza con todas y las va quitando. En cada ronda ajusta el modelo, mira cuál variable contribuye menos y la elimina; luego vuelve a ajustar con las que quedan, porque al quitar una variable las demás cambian de papel. Dos variables gemelas se reparten el efecto mientras ambas están en el modelo, y cada una parece poco importante; en cuanto una se va, la otra recoge todo el efecto y se vuelve imprescindible.

En un modelo lineal con variables estandarizadas, una medida natural de contribución es el valor absoluto del coeficiente: cuánto cambia la predicción por una desviación estándar de la variable. El proceso deja un camino de modelos con $p$, $p - 1$, ..., $1$ variables. Comparando su error de validación se elige cuántas conservar. A diferencia de la envoltura hacia adelante, cada ronda requiere un solo ajuste, lo que lo hace práctico con modelos costosos; a cambio, depende de que la medida de importancia del modelo sea confiable.

## Definición

:::definicion[Eliminación recursiva de características]
Sea $S_0 = \{1, \dots, p\}$. En la ronda $t$:

1. se ajusta el modelo con las variables de $S_t$ y se obtienen sus importancias, por ejemplo $|\hat{\beta}_j(S_t)|$ con variables estandarizadas;
2. se elimina la menos importante:
$$
S_{t+1} = S_t \setminus \{\arg\min_{j \in S_t} |\hat{\beta}_j(S_t)|\};
$$
3. se registra el error de validación $\mathrm{ECM}_{\text{val}}(S_{t+1})$.

Al terminar se elige el subconjunto del camino con menor error de validación, o el más pequeño con error cercano al mínimo.
:::

:::nota[Qué significa cada símbolo]
- $p$: número de variables iniciales.
- $S_t$: conjunto de variables tras $t$ rondas.
- $\hat{\beta}_j(S_t)$: coeficiente estandarizado de la variable $j$ en el modelo con $S_t$.
- $\setminus$: diferencia de conjuntos; quita el elemento indicado.
- $\arg\min$: la variable con la menor importancia.
- $\mathrm{ECM}_{\text{val}}(S)$: error cuadrático medio de validación del modelo con $S$.
:::

## Cómo usar la visualización

Las barras de la izquierda son los valores absolutos de los coeficientes estandarizados del modelo actual; la variable que saldrá en la siguiente ronda se resalta y las ya eliminadas quedan en cero. A la derecha, la curva registra el error de validación de cada tamaño, desde 8 variables hasta ninguna. El encabezado señala el coeficiente mínimo de la ronda.

Experimento sugerido: seguir a la lluvia por satélite. Mientras la lluvia esté en el modelo, su coeficiente es pequeño, porque la información ya la aporta la otra.

## Ejemplo

Con 120 parcelas de entrenamiento, una corrida produce este camino:

| Variables | Variable eliminada después | ECM de validación |
| --- | --- | --- |
| 8 | Letra del lote | 5.9 |
| 7 | Número de parcela | 5.9 |
| 6 | Código del vendedor | 5.9 |
| 5 | Temperatura | 5.9 |
| 4 | Lluvia por satélite | 6.3 |
| 3 | Horas de sol | 6.2 |
| 2 | Fertilizante | 7.3 |
| 1 | Lluvia | 9.5 |
| 0 | ninguna | 19.6 |

1. Los tres códigos salen primero: sus coeficientes son casi cero.
2. La temperatura sale después, porque el modelo lineal no aprovecha su forma de U.
3. Con cuatro variables queda la lluvia por satélite junto a la lluvia; al quitarla, el error no empeora.
4. Las tres variables lineales sostienen casi todo el poder predictivo: con ellas el error es 6.2; con todas, 5.9.

:::figura[La corrida del ejemplo: los códigos y la temperatura salen primero y el error solo sube con fuerza al quitar el fertilizante y la lluvia.]{componente="FeatureSelectionViz"}
```yaml
modo: rfe
semilla: 7
```
:::

## Propiedades

- **Reajusta en cada ronda.** La importancia de cada variable se recalcula sin las ya eliminadas, lo que maneja mejor la redundancia que un filtro.
- **Requiere $p$ ajustes en total**, uno por ronda, frente a $p(p + 1)/2$ de la selección hacia adelante.
- **Depende de la medida de importancia.** Con coeficientes, las variables deben estar estandarizadas; con otros modelos se usan sus propias medidas de importancia.

:::figura[Con otra muestra, el camino es parecido: el error se mantiene casi constante mientras salen las variables irrelevantes y se dispara al quitar las útiles.]{componente="FeatureSelectionViz"}
```yaml
modo: rfe
semilla: 42
```
:::

## Errores comunes

- **Usar coeficientes sin estandarizar.** Un coeficiente pequeño puede deberse solo a que la variable se mide en una unidad grande.
- **Elegir el tamaño con los datos de prueba.** El camino y la elección del tamaño usan validación; la prueba final se hace con datos que no participaron.
- **Interpretar el orden de eliminación como un ranking definitivo.** Entre variables correlacionadas, cuál sale primero depende de la muestra.

:::figura[Error de leer el orden de eliminación como un ranking definitivo: con esta muestra, la lluvia por satélite es la primera variable en salir, mientras que con la muestra principal sale en quinto lugar.]{componente="FeatureSelectionViz"}
```yaml
modo: rfe
semilla: 9
```
:::

## Conexiones

Es la versión hacia atrás de la [[seleccion-de-caracteristicas-por-envoltura]] y usa coeficientes comparables gracias a la [[estandarizacion]]. Comparte con la [[seleccion-de-caracteristicas-embebida]] el uso de los coeficientes del modelo, pero sin penalización. Como cualquier selección, responde a la [[maldicion-de-la-dimensionalidad]] y debe validarse fuera de los datos de ajuste.

## Formulario

:::formula[Ronda de eliminación]
$$
S_{t+1} = S_t \setminus \{\arg\min_{j \in S_t} |\hat{\beta}_j(S_t)|\}
$$

- $S_t$: variables en la ronda $t$.
- $\hat{\beta}_j(S_t)$: coeficiente estandarizado de la variable $j$.
:::

:::formula[Coeficiente estandarizado]
$$
\hat{\beta}_j^{\text{est}} = \hat{\beta}_j\, s_j
$$

- $\hat{\beta}_j$: coeficiente en unidades originales.
- $s_j$: desviación estándar de la variable $j$.
:::
