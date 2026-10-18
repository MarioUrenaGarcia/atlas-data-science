---
id: deteccion-de-valores-atipicos-por-rango-intercuartilico
titulo: Detección de valores atípicos por rango intercuartílico
titulo_en: Outlier detection with the interquartile range
alias:
  - regla de Tukey
  - vallas de Tukey
  - regla 1.5 RIQ
modulo: 4
submodulo: '4.7'
orden: 5
nivel: basico
prerrequisitos:
  - diagrama-de-caja
relaciones:
  - tipo: contrasta
    id: deteccion-de-valores-atipicos-por-puntuacion-z-y-z-modificada
etiquetas:
  - atípicos
  - cuartiles
  - robustez
  - exploración
resumen: >
  La regla de Tukey señala como posible atípico todo valor que quede más de k rangos intercuartílicos por
  debajo del primer cuartil o por encima del tercero, con k = 1.5 de forma habitual y k = 3 para atípicos extremos.
formula: 'x < Q_1 - k\,\text{RIQ}\quad \text{o}\quad x > Q_3 + k\,\text{RIQ}'
visualizacion:
  componente: FeatureTransformViz
  parametros:
    modo: atipicos-riq
    muestra:
      nombre: Glucosa
      forma: colas-pesadas
      parametro: 3
      centro: 95
      escala: 8
      n: 80
    eje:
      variable: Glucosa en ayunas
      unidad: mg/dL
referencias:
  - clave: wasserman
  - clave: james-isl
publicado: true
---

## Intuición

Un laboratorio clínico recibe 80 mediciones de glucosa en ayunas. La mayoría ronda los 95 mg/dL, pero algunas están muy lejos. ¿Cuáles son tan raras que conviene revisarlas? Una regla basada en la media y la desviación estándar tiene un problema: los propios valores extremos inflan la desviación y se esconden. John Tukey propuso usar el centro de los datos, que no se deja arrastrar por los extremos.

La idea es tomar la caja que contiene a la mitad central de los datos, del primer al tercer cuartil, y medir su ancho, el rango intercuartílico. Después se colocan dos **vallas**, a 1.5 anchos de caja por debajo y por encima. Lo que queda fuera de las vallas se marca como posible atípico. No es un veredicto: es una señal para revisar si se trata de un error de captura, de un paciente con una condición distinta o de un valor legítimo de una distribución con colas pesadas.

## Definición

:::definicion[Regla del rango intercuartílico]
Sean $Q_1$ y $Q_3$ el primer y el tercer cuartil de los datos y $\text{RIQ} = Q_3 - Q_1$. Para un factor $k > 0$, las **vallas de Tukey** son
$$
L = Q_1 - k\,\text{RIQ},\qquad U = Q_3 + k\,\text{RIQ},
$$
y un valor $x$ se señala como posible atípico si $x < L$ o $x > U$. Con $k = 1.5$ se obtienen los atípicos habituales (los puntos aislados de un diagrama de caja) y con $k = 3$ los atípicos extremos.
:::

La regla no supone normalidad. Para datos normales, la proporción esperada de valores fuera de las vallas con $k = 1.5$ es de cerca de 0.7 %.

:::nota[Qué significa cada símbolo]
- $Q_1$, $Q_3$: primer y tercer cuartil.
- $\text{RIQ}$: rango intercuartílico, ancho de la caja.
- $k$: factor de las vallas, 1.5 o 3 de forma habitual.
- $L$, $U$: valla inferior y valla superior.
- $x$: un valor de los datos.
:::

## Cómo usar la visualización

La regla se construye por pasos: primero los datos, luego la mediana y los cuartiles, la caja del rango intercuartílico, las vallas y, al final, los puntos que quedan fuera, en otro color. El encabezado muestra el cálculo de cada paso.

El control **Factor de las vallas** cambia $k$ entre 0.5 y 3.

Experimentos sugeridos:

1. Con $k = 1.5$, contar los puntos señalados; con $k = 3$, quedan solo los más extremos.
2. Bajar $k$ a 0.5: se señalan muchos valores perfectamente normales, porque las vallas quedan dentro del cuerpo de los datos.
3. Observar que la caja no cambia con $k$: solo se mueven las vallas.

## Ejemplo

Tiempos de traslado (minutos) de diez empleados: 12, 14, 15, 15, 16, 17, 18, 19, 21 y 35.

1. Cuartiles de tipo 7: $Q_1 = 15$ y $Q_3 = 18.75$; la mediana es 16.5.
2. $\text{RIQ} = 18.75 - 15 = 3.75$.
3. Con $k = 1.5$: $L = 15 - 5.625 = 9.375$ y $U = 18.75 + 5.625 = 24.375$. El 35 queda fuera: posible atípico.
4. Con $k = 3$: $L = 3.75$ y $U = 30$. El 35 sigue fuera: es un atípico extremo.

:::figura[Los diez tiempos de traslado del ejemplo: el valor de 35 minutos queda fuera de ambas vallas.]{componente="FeatureTransformViz"}
```yaml
modo: atipicos-riq
muestra:
  nombre: Traslados
  valores: [12, 14, 15, 15, 16, 17, 18, 19, 21, 35]
eje:
  variable: Tiempo de traslado
  unidad: min
```
:::

## Propiedades

- **Robusta:** los cuartiles casi no cambian si un valor extremo crece; las vallas no se dejan arrastrar.
- **Sin supuesto de normalidad,** aunque la elección de $k = 1.5$ se calibró pensando en datos aproximadamente normales.
- **Sensible a la asimetría:** en distribuciones con cola larga señala muchos valores del lado de la cola que no son errores.
- **Coincide con los puntos aislados del diagrama de caja.**

:::figura[Distribución asimétrica: 120 tiempos de reparación con cola derecha. La regla señala varios valores altos que son parte legítima de la cola.]{componente="FeatureTransformViz"}
```yaml
modo: atipicos-riq
muestra:
  nombre: Reparaciones
  forma: sesgo-derecha
  parametro: 2
  centro: 6
  escala: 3
  n: 120
eje:
  variable: Tiempo de reparación
  unidad: h
```
:::

## Errores comunes

- **Eliminar automáticamente lo que queda fuera.** La regla señala candidatos; cada uno se investiga antes de decidir.
- **Aplicarla a datos muy asimétricos sin transformar.** Conviene aplicarla al logaritmo o usar reglas ajustadas a la asimetría.
- **Pensar que en datos normales no hay valores fuera de las vallas.** Con muestras grandes aparecen algunos por puro azar: cerca de 7 por cada 1000 observaciones.

:::figura[Datos normales sin errores: 400 estaturas. Aun así, unos pocos valores quedan fuera de las vallas por azar.]{componente="FeatureTransformViz"}
```yaml
modo: atipicos-riq
muestra:
  nombre: Estaturas
  forma: normal
  centro: 168
  escala: 7
  n: 400
eje:
  variable: Estatura
  unidad: cm
```
:::

## Conexiones

La regla se construye con los [[cuantiles-cuartiles-deciles-y-percentiles|cuartiles]] y el [[rango-intercuartilico]], y define los bigotes del [[diagrama-de-caja]]. Se contrasta con la [[deteccion-de-valores-atipicos-por-puntuacion-z-y-z-modificada|detección por puntuación z]], que usa la media y la desviación. En datos asimétricos se combina con la [[transformacion-logaritmica-y-de-raiz]].

## Formulario

:::formula[Rango intercuartílico]
$$
\text{RIQ} = Q_3 - Q_1
$$

- $Q_1$, $Q_3$: primer y tercer cuartil.
:::

:::formula[Vallas de Tukey]
$$
L = Q_1 - k\,\text{RIQ},\qquad U = Q_3 + k\,\text{RIQ}
$$

- $L$, $U$: vallas inferior y superior; $k$: factor (1.5 o 3).
:::

:::formula[Criterio de atípico]
$$
x < L \quad \text{o} \quad x > U
$$

- $x$: valor de los datos que se señala si queda fuera de las vallas.
:::
