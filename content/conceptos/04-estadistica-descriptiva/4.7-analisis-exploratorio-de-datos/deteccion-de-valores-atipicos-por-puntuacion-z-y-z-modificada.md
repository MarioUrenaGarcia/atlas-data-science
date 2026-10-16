---
id: deteccion-de-valores-atipicos-por-puntuacion-z-y-z-modificada
titulo: Detección de valores atípicos por puntuación z y z modificada
titulo_en: Outlier detection with z-scores and modified z-scores
alias:
  - regla de las tres sigmas
  - z modificada de Iglewicz y Hoaglin
  - enmascaramiento de atípicos
modulo: 4
submodulo: '4.7'
orden: 6
nivel: basico
prerrequisitos:
  - puntuaciones-z-muestrales
  - desviacion-absoluta-mediana
relaciones:
  - tipo: contrasta
    id: deteccion-de-valores-atipicos-por-rango-intercuartilico
etiquetas:
  - atípicos
  - robustez
  - enmascaramiento
  - exploración
resumen: >
  La regla z señala valores con |z| > 3, pero los propios atípicos inflan la desviación y se enmascaran. La
  z modificada usa la mediana y la MAD, M = 0.6745 (x - mediana)/MAD, y señala |M| > 3.5.
formula: 'z_i = \frac{x_i - \bar{x}}{s},\qquad M_i = \frac{0.6745\,(x_i - \tilde{x})}{\text{MAD}}'
visualizacion:
  componente: FeatureTransformViz
  parametros:
    modo: atipicos-z
    muestra:
      nombre: Pesos
      forma: normal
      centro: 500
      escala: 5
      n: 30
    eje:
      variable: Peso del empaque
      unidad: g
    extremos: [540, 545, 550, 548]
referencias:
  - clave: wasserman
  - clave: hastie-esl
publicado: true
---

## Intuición

Una empacadora llena bolsas de 500 g con una variación de unos 5 g. Una regla sencilla para detectar bolsas anómalas es calcular cuántas desviaciones estándar se aleja cada peso de la media, su puntuación z, y revisar las que pasen de 3. Funciona bien cuando hay una sola anomalía. Pero si una falla en la máquina produce cuatro bolsas de unos 545 g, esas cuatro bolsas suben la media y sobre todo inflan la desviación estándar. Con una desviación inflada, cada bolsa defectuosa parece menos lejana: ninguna supera el umbral. Los atípicos se esconden unos a otros; a eso se le llama **enmascaramiento**.

La solución es medir la distancia con piezas que los atípicos no puedan mover: la mediana en lugar de la media y la desviación absoluta mediana (MAD) en lugar de la desviación estándar. Así se obtiene la **puntuación z modificada** de Iglewicz y Hoaglin, que sigue señalando las cuatro bolsas.

## Definición

:::definicion[Puntuación z y regla de las tres sigmas]
Con media $\bar{x}$ y desviación estándar muestral $s$, la puntuación z de $x_i$ es
$$
z_i = \frac{x_i - \bar{x}}{s},
$$
y se señala como posible atípico si $|z_i| > 3$.
:::

:::definicion[Puntuación z modificada]
Con mediana $\tilde{x}$ y $\text{MAD} = \operatorname{mediana}_i |x_i - \tilde{x}|$, la **puntuación z modificada** es
$$
M_i = \frac{0.6745\,(x_i - \tilde{x})}{\text{MAD}},
$$
y se señala como posible atípico si $|M_i| > 3.5$. La constante 0.6745 hace que, para datos normales, $\text{MAD}/0.6745$ estime $\sigma$, de modo que $M$ es comparable con $z$.
:::

Supuestos: ambas reglas están pensadas para datos aproximadamente simétricos. Si más de la mitad de los datos son iguales, $\text{MAD} = 0$ y la z modificada no está definida.

:::nota[Qué significa cada símbolo]
- $x_i$: valor de la observación $i$.
- $\bar{x}$: media; $s$: desviación estándar muestral; $z_i$: puntuación z.
- $\tilde{x}$: mediana; $\text{MAD}$: desviación absoluta mediana; $M_i$: puntuación z modificada.
- $0.6745$: cuantil 0.75 de la normal estándar, que relaciona la MAD con $\sigma$.
- $\sigma$: desviación estándar de la población.
:::

## Cómo usar la visualización

Dos ejes muestran las mismas bolsas: arriba con su puntuación z y abajo con su z modificada, con las líneas punteadas de los umbrales. Al reproducir, las cuatro bolsas defectuosas se agregan una por una; las que cruzan el umbral cambian de color. El encabezado calcula $z$ y $M$ de la última bolsa agregada.

Controles: **Umbral de z** y **Umbral de z modificada**.

Experimentos sugeridos:

1. Detenerse con una sola bolsa defectuosa: ambas reglas la señalan.
2. Agregar las cuatro: la regla z deja de señalar alguna, o todas, porque la desviación pasa de unos 5 g a más de 15 g.
3. Bajar el umbral de z a 2: vuelve a señalarlas, pero a costa de más falsas alarmas en datos sin atípicos.

## Ejemplo

Nueve tiempos de respuesta de un servidor (ms): 10, 12, 12, 13, 14, 15, 16, 18 y 60.

1. Media y desviación: $\bar{x} \approx 18.89$ y $s \approx 15.60$; el 60 infla ambas.
2. $z = (60 - 18.89)/15.60 \approx 2.64 < 3$: la regla z no señala al 60.
3. Mediana $\tilde{x} = 14$; desviaciones absolutas $|x_i - 14|$: 4, 2, 2, 1, 0, 1, 2, 4 y 46, cuya mediana es $\text{MAD} = 2$.
4. $M = 0.6745\,(60 - 14)/2 \approx 15.5 > 3.5$: la z modificada lo señala con claridad.

:::figura[Los nueve tiempos del ejemplo con el valor de 60 ms agregado al final: z no lo señala y M sí.]{componente="FeatureTransformViz"}
```yaml
modo: atipicos-z
muestra:
  nombre: Respuestas
  valores: [10, 12, 12, 13, 14, 15, 16, 18]
eje:
  variable: Tiempo de respuesta
  unidad: ms
extremos: [60]
```
:::

## Propiedades

- **Enmascaramiento:** varios atípicos del mismo lado inflan $s$ y reducen las puntuaciones z de todos ellos.
- **Punto de ruptura:** la media y la desviación se pueden arruinar con un solo valor; la mediana y la MAD resisten hasta casi la mitad de los datos contaminados.
- **Equivalencia bajo normalidad:** sin atípicos y con datos normales, $z$ y $M$ dan valores parecidos.

:::figura[Sin atípicos: 40 mediciones normales de presión. Las dos puntuaciones casi coinciden y ninguna regla señala valores, salvo el que se agrega.]{componente="FeatureTransformViz"}
```yaml
modo: atipicos-z
muestra:
  nombre: Presión
  forma: normal
  centro: 120
  escala: 8
  n: 40
eje:
  variable: Presión sistólica
  unidad: mmHg
extremos: [152]
```
:::

## Errores comunes

- **Calcular z con los atípicos dentro y confiar en el resultado.** Es justo el caso en que la regla falla por enmascaramiento.
- **Usar la regla z con datos muy asimétricos.** En una cola larga, valores legítimos superan 3 con frecuencia; conviene transformar antes.
- **Olvidar la constante 0.6745.** Sin ella, $M$ no es comparable con $z$ y el umbral 3.5 pierde sentido.

:::figura[Datos asimétricos: 150 montos de compra con cola derecha. La regla z señala compras grandes que son parte normal de la cola.]{componente="FeatureTransformViz"}
```yaml
modo: atipicos-z
muestra:
  nombre: Compras
  forma: sesgo-derecha
  parametro: 2
  centro: 400
  escala: 200
  n: 150
eje:
  variable: Monto de compra
  unidad: pesos
extremos: [2500]
```
:::

## Conexiones

La puntuación z se estudia en [[puntuaciones-z-muestrales]] y la MAD en [[desviacion-absoluta-mediana]]. La [[deteccion-de-valores-atipicos-por-rango-intercuartilico|regla del rango intercuartílico]] es otra alternativa robusta. Para datos asimétricos se combina con la [[transformacion-logaritmica-y-de-raiz]].

## Formulario

:::formula[Puntuación z]
$$
z_i = \frac{x_i - \bar{x}}{s}
$$

- $x_i$: valor; $\bar{x}$: media; $s$: desviación estándar muestral.
:::

:::formula[Desviación absoluta mediana]
$$
\text{MAD} = \operatorname{mediana}_i |x_i - \tilde{x}|
$$

- $\tilde{x}$: mediana de los datos.
:::

:::formula[Puntuación z modificada]
$$
M_i = \frac{0.6745\,(x_i - \tilde{x})}{\text{MAD}}
$$

- $0.6745$: constante que hace comparable $M$ con $z$ en datos normales.
- $\tilde{x}$: mediana; $\text{MAD}$: desviación absoluta mediana.
:::

:::formula[Criterios de señalamiento]
$$
|z_i| > 3,\qquad |M_i| > 3.5
$$

- Umbrales habituales para la puntuación z y la z modificada.
:::
