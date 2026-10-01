---
id: rango-intercuartilico
titulo: Rango intercuartílico
titulo_en: Interquartile range
alias:
  - RIQ
  - IQR
  - amplitud intercuartílica
modulo: 4
submodulo: '4.3'
orden: 8
nivel: basico
prerrequisitos:
  - cuantiles-cuartiles-deciles-y-percentiles
  - rango
etiquetas:
  - dispersión
  - estadística robusta
  - cuartiles
  - 50 % central
resumen: >
  El rango intercuartílico es la distancia entre el tercer y el primer cuartil. Mide la amplitud del
  50 % central de los datos y no se ve afectado por los valores extremos.
formula: '\mathrm{RIQ} = Q_3 - Q_1'
visualizacion:
  componente: DataStrip
  parametros:
    modo: dispersion
    datos: [850, 920, 980, 1050, 1100, 1180, 1250, 1300, 1420, 3900]
    medida: riq
    lecturas: [riq, rango, desviacion]
    variable: Precio por noche de hoteles de una ciudad
    unidad: pesos
    decimales: 0
referencias:
  - clave: degroot
  - clave: wasserman
publicado: true
---

## Intuición

Un viajero que busca hotel en una ciudad quiere saber cuánto cuesta una noche "normalmente". El rango de precios, de 850 a 3,900 pesos, no ayuda: el máximo es una suite de lujo que casi nadie reserva. Más útil es saber entre qué precios está la mitad central de los hoteles, dejando fuera el cuarto más barato y el cuarto más caro. Esa franja va de unos 1,000 a unos 1,290 pesos.

El **rango intercuartílico** es el ancho de esa franja: la distancia entre el primer cuartil y el tercero. Es como el rango, pero calculado después de quitar los extremos de cada lado, por lo que describe la dispersión del grueso de los datos. La suite de 3,900 pesos podría costar 10,000 y el rango intercuartílico no cambiaría. Por eso es la medida de dispersión que acompaña a la mediana, y la que define la caja en un diagrama de caja.

## Definición

:::definicion[Rango intercuartílico]
Si $Q_1 = Q(0.25)$ y $Q_3 = Q(0.75)$ son el primer y el tercer cuartil de los datos, el **rango intercuartílico** es
$$
\mathrm{RIQ} = Q_3 - Q_1.
$$
:::

Contiene, aproximadamente, el 50 % central de los datos. Su valor depende ligeramente del método usado para calcular los cuartiles. Para datos normales, $\mathrm{RIQ} \approx 1.349\,\sigma$, de modo que $\mathrm{RIQ}/1.349$ estima la desviación estándar de forma robusta.

:::figura[Construcción de la caja con las calificaciones de once estudiantes: la animación se detiene cuando la caja, que va de Q1 a Q3, ya está dibujada; su ancho es el rango intercuartílico.]{componente="DataStrip"}
```yaml
modo: caja
datos: [63, 65, 66, 68, 70, 71, 73, 75, 78, 80, 82]
hasta: 3
variable: Calificación del examen
unidad: puntos
decimales: 0
```
:::

:::nota[Qué significa cada símbolo]
- $\mathrm{RIQ}$: rango intercuartílico.
- $Q_1$: primer cuartil, deja aproximadamente 25 % de los datos por debajo.
- $Q_3$: tercer cuartil, deja aproximadamente 75 % por debajo.
- $Q(p)$: cuantil de orden $p$.
- $\sigma$: desviación estándar de la población.
- $1.349$: rango intercuartílico de la distribución normal estándar.
:::

## Cómo usar la visualización

Cada fila es un hotel. Al terminar la animación aparece una franja sombreada entre $Q_1$ y $Q_3$; su ancho es el rango intercuartílico, que el encabezado calcula como la resta de los dos cuartiles. El panel compara el rango intercuartílico con el rango y con la desviación estándar.

Al arrastrar la suite de 3,900 pesos hasta 1,500 pesos, el rango cae de 3,050 a 650 y la desviación estándar de unos 900 a unos 214, mientras que el rango intercuartílico sigue en 290. Solo cambia cuando un hotel cruza de un lado a otro de los cuartiles o cuando se mueven los datos cercanos a ellos.

## Ejemplo

Diez entregas a domicilio tardaron 18, 22, 25, 27, 30, 31, 35, 38, 44 y 60 minutos. Con el método de interpolación más común:

1. $Q_1$: posición $h = 9 \cdot 0.25 + 1 = 3.25$, entre el tercer dato (25) y el cuarto (27): $Q_1 = 25 + 0.25 \cdot 2 = 25.5$ minutos.
2. $Q_3$: posición $h = 9 \cdot 0.75 + 1 = 7.75$, entre el séptimo (35) y el octavo (38): $Q_3 = 35 + 0.75 \cdot 3 = 37.25$ minutos.
3. $\mathrm{RIQ} = 37.25 - 25.5 = 11.75$ minutos.
4. La mitad central de las entregas tarda entre 25.5 y 37.25 minutos; el rango completo, de 42 minutos, está dominado por la entrega de una hora.

:::figura[Las entregas del ejemplo con la franja de Q1 a Q3.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [18, 22, 25, 27, 30, 31, 35, 38, 44, 60]
medida: riq
lecturas: [riq, rango]
variable: Tiempo de entrega
unidad: min
decimales: 0
```
:::

## Propiedades

- **Resistencia:** puede cambiar casi un 25 % de los datos de cada lado sin que el RIQ se vuelva arbitrariamente grande; su punto de ruptura es 25 %.
- **Equivarianza:** si $y_i = a + b x_i$, el RIQ de las $y$ es $|b|$ veces el de las $x$.
- **Base de las vallas de Tukey:** los valores a más de $1.5\,\mathrm{RIQ}$ por fuera de los cuartiles se señalan como posibles atípicos.
- **Estimador robusto de $\sigma$:** para datos aproximadamente normales, $\mathrm{RIQ}/1.349$ se parece a la desviación estándar.

:::figura[Propiedad de resistencia: los mismos hoteles sin la suite de lujo. El rango intercuartílico es idéntico, 290 pesos, mientras que el rango y la desviación estándar bajan mucho.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [850, 920, 980, 1050, 1100, 1180, 1250, 1300, 1420, 1500]
medida: riq
lecturas: [riq, rango, desviacion]
variable: Precio por noche sin la suite
unidad: pesos
decimales: 0
```
:::

## Errores comunes

- **Pensar que contiene exactamente la mitad de los datos.** Con pocos datos o con empates, la franja puede contener un poco más o un poco menos.
- **Compararlo directamente con la desviación estándar.** Miden cosas distintas: para datos normales el RIQ es 1.35 veces la desviación estándar.
- **Usarlo como única medida en datos con colas importantes.** Si interesa el comportamiento de los extremos, como en tiempos de espera largos, el RIQ los oculta por diseño.

:::figura[El RIQ oculta las colas: dos grupos de tiempos de entrega con el mismo 50 % central, pero uno con entregas muy tardías.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [25, 26, 28, 30, 31, 33, 35, 37]
medida: riq
lecturas: [riq, rango]
variable: Entregas, zona centro
unidad: min
decimales: 0
dominio: [20, 95]
comparar:
  datos: [25, 26, 28, 30, 31, 33, 35, 90]
  variable: Entregas, zona periférica
  unidad: min
  dominio: [20, 95]
```
:::

## Conexiones

El RIQ es la diferencia entre dos [[cuantiles-cuartiles-deciles-y-percentiles|cuartiles]] y la versión robusta del [[rango]]. Define el ancho de la caja en el [[resumen-de-cinco-numeros]] y las vallas para detectar valores atípicos. Otra medida robusta de dispersión es la [[desviacion-absoluta-mediana]], que también se escala para estimar $\sigma$.

## Formulario

:::formula[Rango intercuartílico]
$$
\mathrm{RIQ} = Q_3 - Q_1
$$

- $Q_1$, $Q_3$: primer y tercer cuartil.
:::

:::formula[Estimación robusta de σ]
$$
\hat{\sigma}_{\mathrm{RIQ}} = \frac{\mathrm{RIQ}}{1.349}
$$

- $1.349$: rango intercuartílico de una normal estándar.
:::

:::formula[Vallas de Tukey]
$$
Q_1 - 1.5\,\mathrm{RIQ}, \qquad Q_3 + 1.5\,\mathrm{RIQ}
$$

- Los datos fuera de estas vallas se marcan como posibles atípicos.
:::
