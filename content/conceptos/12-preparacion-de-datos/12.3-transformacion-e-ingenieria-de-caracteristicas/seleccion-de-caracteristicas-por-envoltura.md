---
id: seleccion-de-caracteristicas-por-envoltura
titulo: Selección de características por envoltura
titulo_en: Wrapper feature selection
alias:
  - métodos de envoltura
  - selección hacia adelante
  - selección paso a paso
  - wrapper methods
modulo: 12
submodulo: '12.3'
orden: 23
nivel: basico
prerrequisitos:
  - seleccion-de-caracteristicas-por-filtro
etiquetas:
  - selección de características
  - validación
  - búsqueda codiciosa
  - modelos predictivos
resumen: >
  Los métodos de envoltura evalúan subconjuntos de variables ajustando el modelo con cada uno y midiendo su
  error en datos de validación; la selección hacia adelante agrega en cada paso la variable que más lo reduce.
formula: 'j^* = \arg\min_{j \notin S} \mathrm{ECM}_{\text{val}}(S \cup \{j\})'
visualizacion:
  componente: FeatureSelectionViz
  parametros:
    modo: envoltura
referencias:
  - clave: james-isl
  - clave: hastie-esl
publicado: true
---

## Intuición

Un filtro califica cada variable por separado; pero lo que importa es cómo funciona un conjunto de variables dentro del modelo. La lluvia medida en tierra y la medida por satélite son buenas por separado, pero juntas no son mejores que una sola. La única forma directa de saberlo es probar: ajustar el modelo con un conjunto de variables y medir qué tan bien predice datos que no usó para ajustarse.

Los **métodos de envoltura** hacen exactamente eso: envuelven al modelo y lo usan como juez de cada subconjunto. Probar todos los subconjuntos posibles es inviable (con 30 variables hay más de mil millones), así que se usa una búsqueda codiciosa. En la **selección hacia adelante**, se empieza sin variables; en cada paso se prueba agregar cada una de las restantes, se mide el error de validación y se agrega la que más lo reduce. Cuando agregar más deja de ayudar, la curva de error se aplana o sube, y ese punto indica cuántas variables conservar.

## Definición

:::definicion[Selección hacia adelante]
Sea $S_0 = \varnothing$. En el paso $t = 1, 2, \dots$, para cada variable $j \notin S_{t-1}$ se ajusta el modelo con $S_{t-1} \cup \{j\}$ en los datos de entrenamiento y se calcula su error en los de validación. Se agrega la mejor:

$$
j^* = \arg\min_{j \notin S_{t-1}} \mathrm{ECM}_{\text{val}}(S_{t-1} \cup \{j\}), \qquad S_t = S_{t-1} \cup \{j^*\}.
$$

Se elige el tamaño $t$ con menor error de validación. Con $p$ variables, se ajustan $p + (p - 1) + \dots + 1 = p(p + 1)/2$ modelos, en lugar de los $2^p$ subconjuntos posibles.
:::

:::nota[Qué significa cada símbolo]
- $S_t$: conjunto de variables seleccionadas tras $t$ pasos; $S_0$ es vacío.
- $j$: variable candidata que todavía no está en el conjunto.
- $\mathrm{ECM}_{\text{val}}(S)$: error cuadrático medio en validación del modelo ajustado con las variables de $S$.
- $\arg\min$: el valor de $j$ que hace mínima la expresión.
- $j^*$: variable agregada en el paso.
- $p$: número de variables candidatas.
- $2^p$: número de subconjuntos posibles.
:::

## Cómo usar la visualización

En cada paso, las barras de la izquierda muestran el error de validación que tendría el modelo al agregar cada variable candidata; la elegida se resalta y las ya incluidas aparecen en gris. A la derecha, la curva registra el error del mejor modelo de cada tamaño; al terminar se marca el tamaño con menor error. El encabezado indica la variable agregada.

Experimento sugerido: observar en qué paso entra la lluvia por satélite; aunque su correlación con el rendimiento es casi tan alta como la de la lluvia, entra tarde, cuando ya casi no cambia el error, porque repite la información de la lluvia.

## Ejemplo

Con 120 parcelas de entrenamiento y 200 de validación, una corrida de la selección hacia adelante da:

| Paso | Variable agregada | ECM de validación |
| --- | --- | --- |
| 0 | ninguna | 19.6 |
| 1 | Lluvia | 9.5 |
| 2 | Fertilizante | 7.3 |
| 3 | Horas de sol | 6.2 |
| 4 | Temperatura | 5.7 |
| 5 a 7 | tres códigos | 5.7 a 5.7 |
| 8 | Lluvia por satélite | 5.9 |

1. Las tres primeras variables reducen el error a menos de la tercera parte.
2. Del paso 4 en adelante la mejora es mínima; los códigos administrativos casi no cambian el error.
3. La lluvia por satélite entra al final y empeora el error: es redundante con la lluvia.
4. Se conservan 4 variables, o 3 si se prefiere el modelo más simple con error casi igual.

:::figura[La corrida del ejemplo: lluvia, fertilizante y horas de sol entran primero y la copia de la lluvia entra al final, cuando ya empeora el error.]{componente="FeatureSelectionViz"}
```yaml
modo: envoltura
semilla: 7
```
:::

## Propiedades

- **Evalúa variables en conjunto.** Detecta la redundancia que un filtro no ve, porque una variable redundante no reduce el error.
- **Depende del modelo usado como juez.** Un modelo lineal no aprovecha la forma de U invertida de la temperatura; un árbol sí.
- **Es una búsqueda codiciosa.** No garantiza encontrar el mejor subconjunto: una pareja de variables útiles solo en conjunto puede no entrar nunca.

:::figura[Con otra muestra, la ganancia de las últimas variables es todavía menor y la curva se aplana desde el tercer paso.]{componente="FeatureSelectionViz"}
```yaml
modo: envoltura
semilla: 42
```
:::

## Errores comunes

- **Elegir el subconjunto con los mismos datos con que se reporta el error final.** El error de validación usado para elegir queda optimista; el desempeño final se mide en un conjunto de prueba aparte.
- **Ignorar el costo.** Con cientos de variables y un modelo costoso, la búsqueda ajusta miles de modelos.
- **Tomar el mínimo exacto de la curva.** Las diferencias pequeñas entre tamaños son ruido; conviene el modelo más simple con error cercano al mínimo.

:::figura[Error de tomar el mínimo exacto: con esta muestra, el error de validación más bajo se alcanza con seis variables, entre ellas la copia de la lluvia y un código sin relación, mientras que el modelo de tres variables queda apenas 1.3 % arriba.]{componente="FeatureSelectionViz"}
```yaml
modo: envoltura
semilla: 11
```
:::

## Conexiones

Complementa a la [[seleccion-de-caracteristicas-por-filtro]], más rápida pero ciega a la redundancia. La [[eliminacion-recursiva-de-caracteristicas]] recorre el camino inverso, quitando variables. La [[seleccion-de-caracteristicas-embebida]] selecciona dentro del ajuste, sin búsqueda externa. El número de subconjuntos posibles, $2^p$, es el tamaño del [[conjunto-potencia]], y la búsqueda codiciosa es una estrategia de [[problema-de-optimizacion|optimización]] combinatoria aproximada.

## Formulario

:::formula[Paso de la selección hacia adelante]
$$
j^* = \arg\min_{j \notin S_{t-1}} \mathrm{ECM}_{\text{val}}(S_{t-1} \cup \{j\})
$$

- $S_{t-1}$: variables ya elegidas; $j^*$: variable agregada.
- $\mathrm{ECM}_{\text{val}}$: error cuadrático medio de validación.
:::

:::formula[Error cuadrático medio de validación]
$$
\mathrm{ECM}_{\text{val}}(S) = \frac{1}{n_v}\sum_{i=1}^{n_v} \big(y_i - \hat{y}_i(S)\big)^2
$$

- $n_v$: observaciones de validación.
- $y_i$: respuesta observada; $\hat{y}_i(S)$: predicción del modelo con las variables de $S$.
:::

:::formula[Modelos ajustados]
$$
\sum_{t=1}^{p} (p - t + 1) = \frac{p(p + 1)}{2}
$$

- $p$: número de variables candidatas.
:::
