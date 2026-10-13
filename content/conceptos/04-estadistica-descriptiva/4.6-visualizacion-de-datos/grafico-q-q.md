---
id: grafico-q-q
titulo: Gráfico Q-Q
titulo_en: Q-Q plot
alias:
  - gráfico cuantil-cuantil
  - gráfico de probabilidad normal
  - QQ plot
modulo: 4
submodulo: '4.6'
orden: 8
nivel: basico
prerrequisitos:
  - cuantiles-cuartiles-deciles-y-percentiles
  - puntuaciones-z-muestrales
etiquetas:
  - visualización
  - normalidad
  - cuantiles
  - diagnóstico
resumen: >
  El gráfico Q-Q compara los cuantiles de los datos con los de una distribución de referencia,
  normalmente la normal. Si los puntos siguen una recta, la forma coincide; las curvas revelan sesgo y colas.
formula: '\left(\Phi^{-1}\!\left(\frac{i - 0.5}{n}\right),\ x_{(i)}\right), \quad i = 1, \dots, n'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: probabilidad
    tipo: qq
    muestra:
      nombre: Ingresos
      forma: sesgo-derecha
      parametro: 2
      centro: 15
      escala: 5
      n: 80
    eje:
      variable: Ingreso mensual
      unidad: miles de pesos
referencias:
  - clave: wasserman
  - clave: degroot
publicado: true
---

## Intuición

Para saber si unos datos tienen forma de campana, se puede comparar un histograma con una curva normal, pero el ojo se fija en el centro y le cuesta ver las colas. El gráfico Q-Q hace la comparación de otra manera: ordena los datos y pone cada uno junto al valor que le correspondería en esa posición si los datos fueran normales. El dato más pequeño de 80 se compara con el valor que deja 0.6 % de una normal por debajo; el de en medio, con el centro de la normal; el más grande, con el que deja 99.4 % por debajo.

Si los datos son normales, cada pareja está en proporción y los puntos forman una recta. Si no lo son, la forma en que se doblan los puntos dice cómo difieren: una curva que se aleja hacia arriba en el extremo derecho indica una cola derecha más larga que la normal; una forma de S indica colas más pesadas o más ligeras. Es una de las herramientas de diagnóstico más usadas, porque las desviaciones en las colas, que son las que más importan, se vuelven muy visibles.

## Definición

:::definicion[Gráfico Q-Q normal]
Sean $x_{(1)} \le \dots \le x_{(n)}$ los datos ordenados y $p_i = (i - 0.5)/n$ las posiciones de graficación. El **gráfico Q-Q normal** dibuja los puntos

$$
\left(z_i,\ x_{(i)}\right), \qquad z_i = \Phi^{-1}(p_i),
$$

donde $\Phi^{-1}$ es la función cuantil de la normal estándar. Si los datos provienen de una normal $\mathcal{N}(\mu, \sigma^2)$, los puntos se acercan a la recta $x = \mu + \sigma z$.
:::

Para comparar con otra distribución se usan sus cuantiles en lugar de los de la normal; para comparar dos muestras, se grafican los cuantiles de una contra los de la otra.

:::figura[Datos normales: 80 estaturas. Los puntos siguen la recta de referencia, con pequeñas oscilaciones en los extremos.]{componente="ChartGallery"}
```yaml
grafico: probabilidad
tipo: qq
muestra:
  nombre: Estaturas
  forma: normal
  centro: 170
  escala: 7
  n: 80
eje:
  variable: Estatura
  unidad: cm
```
:::

:::nota[Qué significa cada símbolo]
- $x_{(i)}$: $i$-ésimo dato ordenado, el cuantil muestral.
- $n$: número de datos.
- $p_i = (i - 0.5)/n$: proporción asignada al dato $i$.
- $\Phi^{-1}$: función cuantil de la normal estándar.
- $z_i$: cuantil teórico normal correspondiente.
- $\mu$, $\sigma$: media y desviación estándar; $\mathcal{N}(\mu, \sigma^2)$: distribución normal.
:::

## Cómo usar la visualización

Los 80 ingresos se agregan del más pequeño al más grande. Para cada uno, el encabezado muestra su posición, su valor y el cuantil normal que le corresponde. La línea discontinua es la recta que seguirían los datos si fueran normales con su misma media y desviación estándar.

Los puntos forman una curva cóncava hacia arriba: en el extremo izquierdo quedan por encima de la recta, porque los ingresos bajos no se alejan tanto de la media como en una normal, y en el extremo derecho se disparan por encima, porque hay ingresos mucho más altos de lo que una normal permitiría. Es la firma de una asimetría positiva.

## Ejemplo

Cinco tiempos de reacción, en décimas de segundo: 4.1, 5.0, 5.3, 6.2, 7.9.

1. Posiciones: $p_i = (i - 0.5)/5$, es decir, 0.1, 0.3, 0.5, 0.7, 0.9.
2. Cuantiles normales: $z_i = \Phi^{-1}(p_i) \approx -1.282, -0.524, 0, 0.524, 1.282$.
3. Puntos del gráfico: $(-1.282, 4.1)$, $(-0.524, 5.0)$, $(0, 5.3)$, $(0.524, 6.2)$, $(1.282, 7.9)$.
4. Recta de referencia con $\bar{x} = 5.7$ y $s \approx 1.44$: en $z = 1.282$ predice $5.7 + 1.44 \cdot 1.282 \approx 7.55$. El último punto, 7.9, queda por encima: sugiere una cola derecha algo más larga, aunque con cinco datos la evidencia es débil.

:::figura[Los cinco tiempos del ejemplo con la recta de referencia.]{componente="ChartGallery"}
```yaml
grafico: probabilidad
tipo: qq
muestra:
  nombre: Reacción
  valores: [4.1, 5.0, 5.3, 6.2, 7.9]
eje:
  variable: Tiempo de reacción
  unidad: décimas de segundo
```
:::

## Propiedades

- **Invariante ante cambios de escala:** si los datos son normales con cualquier media y desviación, los puntos forman una recta; solo cambian su pendiente y su ordenada.
- **Patrones típicos:** curva cóncava hacia arriba, asimetría positiva; cóncava hacia abajo, asimetría negativa; forma de S con extremos fuera de la recta, colas pesadas; forma de S invertida, colas ligeras.
- **Las colas dominan:** los puntos de los extremos son los más variables; desviaciones pequeñas allí son normales con pocos datos.
- **Comparación de dos muestras:** graficar cuantiles contra cuantiles detecta diferencias de forma aunque las muestras tengan distinto tamaño.

:::figura[Patrón de colas pesadas: 100 rendimientos diarios de una t con 3 grados de libertad. Los puntos forman una S: los extremos se alejan de la recta en ambos lados.]{componente="ChartGallery"}
```yaml
grafico: probabilidad
tipo: qq
muestra:
  nombre: Rendimientos
  forma: colas-pesadas
  parametro: 3
  centro: 0
  escala: 1
  n: 100
eje:
  variable: Rendimiento diario
  unidad: '%'
```
:::

## Errores comunes

- **Exigir una recta perfecta.** Incluso con datos normales, los puntos de los extremos oscilan; con 20 datos, desviaciones moderadas son esperables.
- **Confundir los ejes.** Algunos programas ponen los cuantiles teóricos en el eje vertical; la interpretación de la curvatura se invierte.
- **Concluir normalidad con pocos datos.** Con 10 datos casi cualquier forma pasa por una recta.

:::figura[Colas ligeras: 100 errores de redondeo uniformes. La S invertida indica que los extremos son menos lejanos que en una normal.]{componente="ChartGallery"}
```yaml
grafico: probabilidad
tipo: qq
muestra:
  nombre: Errores
  forma: uniforme
  centro: 0
  escala: 1
  n: 100
eje:
  variable: Error de redondeo
  unidad: mm
```
:::

## Conexiones

El gráfico Q-Q compara [[cuantiles-cuartiles-deciles-y-percentiles|cuantiles]] muestrales con cuantiles teóricos, usando una escala de [[puntuaciones-z-muestrales|puntuaciones z]]. Revela la [[asimetria-muestral]] y las [[colas-ligeras-y-pesadas-en-datos]]. Su pariente, el [[grafico-p-p]], compara probabilidades en lugar de cuantiles y es más sensible en el centro. Los métodos 8 y 9 de cálculo de cuantiles se diseñaron para estas posiciones de graficación.

## Formulario

:::formula[Puntos del gráfico Q-Q normal]
$$
\left(\Phi^{-1}\!\left(\frac{i - 0.5}{n}\right),\ x_{(i)}\right)
$$

- $x_{(i)}$: dato ordenado; $n$: número de datos; $\Phi^{-1}$: cuantil normal estándar.
:::

:::formula[Recta de referencia]
$$
x = \bar{x} + s\,z
$$

- $\bar{x}$: media muestral; $s$: desviación estándar; $z$: cuantil normal.
:::
