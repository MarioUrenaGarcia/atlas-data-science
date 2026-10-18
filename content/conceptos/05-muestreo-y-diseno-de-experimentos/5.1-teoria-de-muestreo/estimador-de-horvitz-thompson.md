---
id: estimador-de-horvitz-thompson
titulo: Estimador de Horvitz-Thompson
titulo_en: Horvitz-Thompson estimator
alias:
  - estimador HT
  - estimador de expansión
  - ponderación por el inverso de la probabilidad
modulo: 5
submodulo: '5.1'
orden: 13
nivel: intermedio
prerrequisitos:
  - muestreo-con-probabilidad-proporcional-al-tamano
relaciones:
  - tipo: generaliza
    id: muestreo-aleatorio-simple
  - tipo: relacionado
    id: media-ponderada
etiquetas:
  - probabilidades de inclusión
  - pesos de diseño
  - estimador insesgado
  - muestreo sin reemplazo
resumen: >
  Estima el total de una población sumando cada valor observado dividido entre su probabilidad de
  inclusión. Es insesgado para cualquier diseño sin reemplazo en el que todas las unidades tengan
  probabilidad positiva de entrar.
formula: '\hat{T}_{HT} = \sum_{i \in \mathcal{S}} \frac{y_i}{\pi_i}'
visualizacion:
  componente: SamplingWeights
  parametros:
    modo: horvitz-thompson
    diseno: pps
    disenos: [pps, poisson, mas]
    n: 4
    comparar: true
    repeticiones: 600
    variable: Producción de aguacate
    unidad: t
    nombreTamano: Hectáreas
    nombreUnidad: Huerta
    unidades:
      - { nombre: A, tamano: 12, valor: 118 }
      - { nombre: B, tamano: 4, valor: 35 }
      - { nombre: C, tamano: 22, valor: 230 }
      - { nombre: D, tamano: 8, valor: 84 }
      - { nombre: E, tamano: 18, valor: 165 }
      - { nombre: F, tamano: 6, valor: 66 }
      - { nombre: G, tamano: 15, valor: 152 }
      - { nombre: H, tamano: 5, valor: 41 }
      - { nombre: I, tamano: 10, valor: 108 }
      - { nombre: J, tamano: 3, valor: 27 }
referencias:
  - clave: lohr
    capitulo: '6'
  - clave: casella-berger
publicado: true
---

## Intuición

Si una huerta tenía 40 % de probabilidad de entrar en la muestra y entró, se puede pensar que "representa" a sí misma y a una fracción de otras huertas parecidas que no entraron: en total, a $1/0.4 = 2.5$ huertas. Si otra tenía solo 10 % de probabilidad, representa a 10. El **estimador de Horvitz-Thompson** suma la producción de cada huerta observada multiplicada por el número de huertas que representa.

La idea es tan general que funciona con cualquier forma de sortear: probabilidades iguales, proporcionales al tamaño, distintas por estrato, en varias etapas. Lo único que exige es conocer, para cada unidad que salió, cuál era su probabilidad de salir, y que ninguna unidad de la población tuviera probabilidad cero. Si se sortea con probabilidades desiguales y luego se ignoran, las huertas grandes, que salen con más frecuencia, inflan la estimación; dividiendo entre las probabilidades, ese desequilibrio se compensa exactamente en promedio.

## Definición

:::definicion[Estimador de Horvitz-Thompson]
Sea un diseño sin reemplazo en el que la unidad $i$ entra en la muestra $\mathcal{S}$ con probabilidad de inclusión $\pi_i > 0$. El estimador de Horvitz-Thompson del total $T = \sum_{i=1}^{N} y_i$ es
$$
\hat{T}_{HT} = \sum_{i \in \mathcal{S}} \frac{y_i}{\pi_i} = \sum_{i \in \mathcal{S}} w_i\,y_i, \qquad w_i = \frac{1}{\pi_i},
$$
y la media se estima con $\hat{T}_{HT}/N$.
:::

Escribiendo $\hat{T}_{HT} = \sum_{i=1}^{N} \mathbf{1}\{i \in \mathcal{S}\}\,y_i/\pi_i$ y usando $\mathbb{E}[\mathbf{1}\{i \in \mathcal{S}\}] = \pi_i$, la linealidad de la esperanza da $\mathbb{E}[\hat{T}_{HT}] = T$. Su varianza depende de las probabilidades conjuntas $\pi_{ij}$ de que $i$ y $j$ entren juntas:
$$
\operatorname{Var}(\hat{T}_{HT}) = \sum_{i=1}^{N}\sum_{j=1}^{N}\left(\pi_{ij} - \pi_i\pi_j\right)\frac{y_i}{\pi_i}\frac{y_j}{\pi_j},
$$
con $\pi_{ii} = \pi_i$. En un diseño proporcional al tamaño con $n$ fijo se usa $\pi_i = n\,x_i/\sum_j x_j$, y las unidades con $\pi_i \ge 1$ se incluyen con certeza.

:::nota[Qué significa cada símbolo]
- $\mathcal{S}$: muestra; $N$: tamaño de la población.
- $y_i$: valor de la unidad $i$; $T$: total de la población.
- $\pi_i$: probabilidad de que la unidad $i$ quede en la muestra.
- $w_i = 1/\pi_i$: peso de diseño, el número de unidades que representa la unidad $i$.
- $\pi_{ij}$: probabilidad de que $i$ y $j$ queden juntas en la muestra.
- $\mathbf{1}\{i \in \mathcal{S}\}$: indicadora de que la unidad $i$ salió.
- $x_i$: medida de tamaño de la unidad $i$; $n$: tamaño de muestra.
:::

## Cómo usar la visualización

La barra de arriba coloca las diez huertas una tras otra, cada una con longitud igual a su probabilidad de inclusión; las probabilidades suman $n = 4$. En el diseño sistemático proporcional al tamaño se elige un arranque $u$ y se toman las huertas que caen en $u$, $u + 1$, $u + 2$ y $u + 3$. El encabezado suma cada producción dividida entre su probabilidad. Abajo, el histograma acumula las estimaciones del total y la línea negra muestra el estimador ingenuo $N\bar{y}$.

Experimentos sugeridos:

- Observa que el histograma de Horvitz-Thompson se centra en el total real y el de $N\bar{y}$ queda a la derecha.
- Cambia el diseño a aleatorio simple: las dos estimaciones coinciden, porque todas las $\pi_i$ son iguales.
- Cambia a Poisson: el número de huertas en la muestra varía y el histograma se ensancha.

## Ejemplo

Cuatro hospitales tienen 50, 100, 150 y 200 camas ($\sum x = 500$) y atendieron 1200, 2600, 3500 y 5100 pacientes ($T = 12400$). Se eligen $n = 2$ con probabilidad proporcional a las camas.

1. Probabilidades de inclusión: $\pi_i = 2 x_i/500 = 0.2,\ 0.4,\ 0.6,\ 0.8$.
2. Pesos: $w_i = 5,\ 2.5,\ 1.67,\ 1.25$.
3. Si salen el segundo y el cuarto: $\hat{T}_{HT} = 2600/0.4 + 5100/0.8 = 6500 + 6375 = 12875$.
4. Si salen el primero y el tercero: $\hat{T}_{HT} = 1200/0.2 + 3500/0.6 = 6000 + 5833 = 11833$.
5. Con el estimador ingenuo $N\bar{y} = 4\bar{y}$, la primera muestra daría $4 \cdot 3850 = 15400$, muy por encima de $T$, porque los hospitales grandes salen más a menudo.

:::figura[Los cuatro hospitales del ejemplo: cada barra mide la probabilidad de inclusión de un hospital y cada muestra de dos se expande con sus pesos.]{componente="SamplingWeights"}
```yaml
modo: horvitz-thompson
diseno: pps
n: 2
comparar: true
repeticiones: 300
variable: Pacientes atendidos
nombreTamano: Camas
nombreUnidad: Hospital
unidades:
  - { nombre: Hospital 1, tamano: 50, valor: 1200 }
  - { nombre: Hospital 2, tamano: 100, valor: 2600 }
  - { nombre: Hospital 3, tamano: 150, valor: 3500 }
  - { nombre: Hospital 4, tamano: 200, valor: 5100 }
```
:::

## Propiedades

- **Insesgado para cualquier diseño** con $\pi_i > 0$ para todas las unidades.
- **Contiene a los demás estimadores como casos particulares:** con $\pi_i = n/N$ se obtiene $N\bar{y}$ del muestreo aleatorio simple; con $\pi_i = n_h/N_h$ en cada estrato se obtiene el estimador estratificado.
- **Varianza pequeña cuando $\pi_i \propto y_i$:** si las probabilidades son proporcionales a los valores, todos los cocientes $y_i/\pi_i$ son iguales y la varianza es cero.
- **Con tamaño de muestra aleatorio** (diseño de Poisson) sigue siendo insesgado, pero su varianza crece porque el número de términos de la suma cambia de muestra a muestra.

:::figura[Propiedad del caso particular: con muestreo aleatorio simple todas las huertas tienen la misma probabilidad y el estimador de Horvitz-Thompson coincide con N por la media.]{componente="SamplingWeights"}
```yaml
modo: horvitz-thompson
diseno: mas
n: 4
comparar: true
repeticiones: 600
variable: Producción de aguacate
unidad: t
nombreTamano: Hectáreas
nombreUnidad: Huerta
unidades:
  - { nombre: A, tamano: 12, valor: 118 }
  - { nombre: B, tamano: 4, valor: 35 }
  - { nombre: C, tamano: 22, valor: 230 }
  - { nombre: D, tamano: 8, valor: 84 }
  - { nombre: E, tamano: 18, valor: 165 }
  - { nombre: F, tamano: 6, valor: 66 }
  - { nombre: G, tamano: 15, valor: 152 }
  - { nombre: H, tamano: 5, valor: 41 }
  - { nombre: I, tamano: 10, valor: 108 }
  - { nombre: J, tamano: 3, valor: 27 }
```
:::

:::figura[Propiedad del tamaño aleatorio: con el diseño de Poisson cada huerta entra por su cuenta y el número de huertas en la muestra cambia; el estimador sigue centrado pero es más disperso.]{componente="SamplingWeights"}
```yaml
modo: horvitz-thompson
diseno: poisson
n: 4
repeticiones: 600
variable: Producción de aguacate
unidad: t
nombreTamano: Hectáreas
nombreUnidad: Huerta
unidades:
  - { nombre: A, tamano: 12, valor: 118 }
  - { nombre: B, tamano: 4, valor: 35 }
  - { nombre: C, tamano: 22, valor: 230 }
  - { nombre: D, tamano: 8, valor: 84 }
  - { nombre: E, tamano: 18, valor: 165 }
  - { nombre: F, tamano: 6, valor: 66 }
  - { nombre: G, tamano: 15, valor: 152 }
  - { nombre: H, tamano: 5, valor: 41 }
  - { nombre: I, tamano: 10, valor: 108 }
  - { nombre: J, tamano: 3, valor: 27 }
```
:::

## Errores comunes

- **Ignorar las probabilidades al estimar.** Con probabilidades desiguales, $N\bar{y}$ está sesgado hacia las unidades con $\pi_i$ grande.
- **Usar probabilidades de inclusión muy pequeñas para unidades con valores grandes.** Si una unidad grande tiene $\pi_i$ chica, cuando sale su peso es enorme y la estimación salta; la varianza explota.
- **Confundir la probabilidad de una extracción con la probabilidad de inclusión.** En un diseño sin reemplazo con $n$ extracciones, $\pi_i$ es la probabilidad de aparecer en alguna de ellas, no la de una sola.

:::figura[Error de probabilidades mal elegidas: tiendas cuya superficie casi no tiene relación con sus ventas. La tienda con más ventas tiene poca superficie y probabilidad pequeña; cuando sale, la estimación se dispara.]{componente="SamplingWeights"}
```yaml
modo: horvitz-thompson
diseno: pps
disenos: [pps, mas]
n: 3
repeticiones: 600
variable: Ventas mensuales
unidad: miles de pesos
nombreTamano: Metros cuadrados
nombreUnidad: Tienda
unidades:
  - { nombre: T1, tamano: 300, valor: 410 }
  - { nombre: T2, tamano: 250, valor: 380 }
  - { nombre: T3, tamano: 280, valor: 300 }
  - { nombre: T4, tamano: 40, valor: 950 }
  - { nombre: T5, tamano: 220, valor: 350 }
  - { nombre: T6, tamano: 260, valor: 330 }
  - { nombre: T7, tamano: 240, valor: 420 }
  - { nombre: T8, tamano: 210, valor: 360 }
```
:::

## Conexiones

El estimador de Horvitz-Thompson es la forma general de los estimadores del [[muestreo-aleatorio-simple]], del [[muestreo-estratificado]] y del [[muestreo-con-probabilidad-proporcional-al-tamano]] en su versión sin reemplazo. Es una [[media-ponderada|suma ponderada]] con pesos $1/\pi_i$, la misma idea que sostiene la ponderación de encuestas y, fuera del muestreo, la ponderación por el inverso de la probabilidad usada en inferencia causal.

## Formulario

:::formula[Estimador de Horvitz-Thompson del total]
$$
\hat{T}_{HT} = \sum_{i \in \mathcal{S}} \frac{y_i}{\pi_i}
$$

- $y_i$: valor observado de la unidad $i$.
- $\pi_i$: probabilidad de inclusión de la unidad $i$.
- $\mathcal{S}$: muestra.
:::

:::formula[Insesgamiento]
$$
\mathbb{E}[\hat{T}_{HT}] = \sum_{i=1}^{N} \pi_i\,\frac{y_i}{\pi_i} = T
$$

- $T$: total real; requiere $\pi_i > 0$ para toda unidad.
:::

:::formula[Varianza del estimador]
$$
\operatorname{Var}(\hat{T}_{HT}) = \sum_{i=1}^{N}\sum_{j=1}^{N}\left(\pi_{ij} - \pi_i\pi_j\right)\frac{y_i}{\pi_i}\frac{y_j}{\pi_j}
$$

- $\pi_{ij}$: probabilidad de inclusión conjunta, con $\pi_{ii} = \pi_i$.
:::

:::formula[Probabilidad de inclusión proporcional al tamaño]
$$
\pi_i = n\,\frac{x_i}{\sum_{j=1}^{N} x_j}
$$

- $x_i$: medida de tamaño; $n$: tamaño de muestra fijo.
- Si el resultado es mayor que 1, la unidad se incluye con certeza.
:::
