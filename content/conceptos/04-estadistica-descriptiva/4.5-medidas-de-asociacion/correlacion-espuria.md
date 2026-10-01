---
id: correlacion-espuria
titulo: Correlación espuria
titulo_en: Spurious correlation
alias:
  - correlación sin sentido
  - regresión espuria
  - tendencias comunes
modulo: 4
submodulo: '4.5'
orden: 6
nivel: basico
prerrequisitos:
  - correlacion-no-implica-causalidad
  - datos-transversales-longitudinales-y-de-panel
etiquetas:
  - correlación
  - series de tiempo
  - tendencia
  - azar
resumen: >
  Una correlación espuria es una asociación fuerte entre variables sin relación real, producida por
  tendencias comunes en el tiempo, por caminatas aleatorias o por buscar entre muchas parejas.
formula: 'r(x_t, y_t) \text{ alta}, \qquad r(\Delta x_t, \Delta y_t) \approx 0'
visualizacion:
  componente: AssociationViz
  parametros:
    modo: espuria
    nombres:
      x: Índice de precios de la ciudad A
      y: Nivel de un lago en otra región
    pasos: 150
referencias:
  - clave: shumway-stoffer
    capitulo: '2'
  - clave: hyndman-fpp
publicado: true
---

## Intuición

Entre 2015 y 2022, el porcentaje de hogares con internet en un país y el consumo de aguacate por persona en otro país crecieron año con año. La correlación entre ambas series es de 0.98, aunque no hay ningún mecanismo que conecte una cosa con la otra. Lo único que comparten es que ambas aumentan con el tiempo.

Esa es una **correlación espuria**: un coeficiente alto que no refleja ninguna relación entre las variables. Aparece sobre todo con datos ordenados en el tiempo. Dos series que tienen tendencia, o que se mueven como caminatas aleatorias acumulando cambios, tienden a parecer relacionadas aunque se generen de forma completamente independiente, porque sus valores recientes dependen de los anteriores y ambas se alejan de su punto de partida. También aparece cuando se buscan correlaciones entre cientos de variables: alguna saldrá alta por pura suerte.

## Definición

:::definicion[Correlación espuria]
Se llama **espuria** a una correlación entre $X$ y $Y$ que no se debe a una relación causal entre ellas ni a una causa común de interés, sino a una tendencia compartida, a la dependencia temporal de cada serie o al azar en una búsqueda múltiple.
:::

Dos señales prácticas permiten sospecharla en series de tiempo: la correlación de los **niveles** $x_t, y_t$ es alta, pero la correlación de los **cambios** $\Delta x_t = x_t - x_{t-1}$ y $\Delta y_t = y_t - y_{t-1}$ es cercana a cero; y la correlación cambia mucho al usar otro periodo.

:::figura[Tendencias comunes: dos series independientes que suben con una deriva constante. La correlación de los niveles es muy alta solo porque ambas crecen con el tiempo.]{componente="AssociationViz"}
```yaml
modo: espuria
nombres:
  x: Usuarios de una red social
  y: Producción de cemento
pasos: 120
deriva: [0.4, 0.3]
```
:::

:::nota[Qué significa cada símbolo]
- $x_t$, $y_t$: valores de las dos series en el periodo $t$.
- $\Delta x_t = x_t - x_{t-1}$: cambio de la serie entre un periodo y el anterior.
- $r(\cdot, \cdot)$: correlación de Pearson.
- $t$: índice del periodo.
:::

## Cómo usar la visualización

A la izquierda se dibujan, periodo a periodo, dos caminatas aleatorias generadas de manera independiente: en cada paso cada serie suma un cambio al azar a su valor anterior. A la derecha está el diagrama de dispersión de una serie contra la otra. El panel compara la correlación de los niveles con la de los cambios.

Con frecuencia la correlación de los niveles supera 0.5 en valor absoluto, aunque las series no tengan nada que ver. Al activar "Usar cambios entre periodos", el diagrama muestra los cambios y la correlación cae cerca de cero. Al generar nuevas semillas, la correlación de los niveles salta entre valores positivos y negativos grandes: no es estable porque no hay una relación de fondo.

## Ejemplo

| Año | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hogares con internet (%) | 38 | 45 | 52 | 57 | 63 | 67 | 70 | 72 |
| Aguacate por persona (kg) | 4.1 | 4.4 | 4.9 | 5.6 | 5.9 | 6.3 | 6.9 | 7.2 |

1. Correlación de los niveles: $r \approx 0.98$.
2. Cambios anuales de internet: 7, 7, 5, 6, 4, 3, 2. Cambios del aguacate: 0.3, 0.5, 0.7, 0.3, 0.4, 0.6, 0.3.
3. Correlación de los cambios: $r \approx -0.08$. Los años en que más creció el internet no son los años en que más creció el aguacate.
4. La correlación alta solo dice que ambas series crecieron en el mismo periodo.

:::figura[Los niveles del ejemplo: ocho años casi alineados en una recta, con r = 0.98.]{componente="AssociationViz"}
```yaml
modo: correlacion
medida: pearson
lecturas: [pearson]
puntos: [[38, 4.1], [45, 4.4], [52, 4.9], [57, 5.6], [63, 5.9], [67, 6.3], [70, 6.9], [72, 7.2]]
nombres:
  x: Hogares con internet (%)
  y: Aguacate por persona (kg)
recta: true
decimales: 1
```
:::

## Propiedades

- **Las caminatas aleatorias producen correlaciones grandes:** la correlación muestral de dos caminatas independientes no se concentra en cero al crecer $n$; tiene una distribución muy dispersa.
- **Diferenciar ayuda:** los cambios de una caminata aleatoria son independientes entre periodos, y su correlación sí se comporta como la de datos sin relación.
- **Búsqueda múltiple:** con $m$ parejas sin relación, el número esperado de correlaciones "significativas" al 5 % es $0.05\,m$.
- **Una causa común no es una correlación espuria** en el mismo sentido: los helados y los golpes de calor sí comparten una causa real; aquí no hay ninguna.

:::figura[Propiedad de la diferenciación: las mismas caminatas con la opción de cambios activada desde el inicio. El diagrama de dispersión pierde toda tendencia.]{componente="AssociationViz"}
```yaml
modo: espuria
nombres:
  x: Índice de precios de la ciudad A
  y: Nivel de un lago en otra región
pasos: 150
diferencias: true
```
:::

## Errores comunes

- **Correlacionar series con tendencia sin quitarla.** Casi cualquier par de variables que crecen con el tiempo, como población, PIB o número de teléfonos, tendrá correlación alta.
- **Presentar la mejor de muchas correlaciones como hallazgo.** Si se revisaron 200 parejas, encontrar una correlación alta es lo esperado aunque ninguna relación sea real.
- **Usar series cortas.** Con pocos periodos, la correlación de dos series independientes puede ser enorme por azar.

:::figura[Series cortas: solo 20 periodos de dos caminatas independientes. Al cambiar la semilla aparecen correlaciones de 0.7 o de -0.8 con facilidad.]{componente="AssociationViz"}
```yaml
modo: espuria
nombres:
  x: Serie A
  y: Serie B
pasos: 20
```
:::

## Conexiones

La correlación espuria es el caso extremo de [[correlacion-no-implica-causalidad]]: ni siquiera hay una causa común. Aparece sobre todo en datos [[datos-transversales-longitudinales-y-de-panel|longitudinales]], donde los valores dependen de los anteriores. Su tratamiento formal pertenece a las series de tiempo, con los conceptos de tendencia, estacionariedad y cointegración.

## Formulario

:::formula[Cambios entre periodos]
$$
\Delta x_t = x_t - x_{t-1}
$$

- $x_t$: valor en el periodo $t$; $x_{t-1}$: valor en el periodo anterior.
:::

:::formula[Caminata aleatoria]
$$
x_t = x_{t-1} + \delta + \varepsilon_t
$$

- $\delta$: deriva constante (cero si no hay tendencia).
- $\varepsilon_t$: cambio aleatorio del periodo $t$, independiente de los anteriores.
:::

:::formula[Falsos hallazgos esperados]
$$
\mathbb{E}[\text{falsos hallazgos}] = \alpha\,m
$$

- $\alpha$: nivel de significancia, por ejemplo 0.05.
- $m$: número de parejas sin relación que se examinan.
:::
