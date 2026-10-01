---
id: desviacion-estandar-muestral
titulo: Desviación estándar muestral
titulo_en: Sample standard deviation
alias:
  - desviación típica
  - desvío estándar
  - s
modulo: 4
submodulo: '4.3'
orden: 4
nivel: basico
prerrequisitos:
  - varianza-muestral
etiquetas:
  - dispersión
  - desviación estándar
  - regla empírica
  - escala
resumen: >
  La desviación estándar muestral es la raíz cuadrada de la varianza. Mide la distancia típica de los
  datos a su media en las mismas unidades que los datos.
formula: 's = \sqrt{\frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar{x})^2}'
visualizacion:
  componente: DataStrip
  parametros:
    modo: dispersion
    datos: [61, 64, 58, 72, 66, 69, 75, 63, 70, 67, 80, 59]
    medida: desviacion
    lecturas: [desviacion, varianza, rango]
    banda: true
    variable: Frecuencia cardiaca en reposo
    unidad: lpm
    decimales: 0
    dominio: [54, 84]
referencias:
  - clave: degroot
  - clave: wasserman
publicado: true
---

## Intuición

La varianza de la frecuencia cardiaca de un grupo de corredores puede ser 43.5, pero ¿43.5 qué? Latidos por minuto al cuadrado, una unidad que nadie sabe imaginar. Sacando la raíz cuadrada se regresa a latidos por minuto: unos 6.6. Ese número sí se interpreta: los corredores suelen estar a unos 6 o 7 latidos por minuto de la media del grupo, algunos más cerca y otros más lejos.

La **desviación estándar** es esa distancia típica. No es exactamente el promedio de las distancias a la media, porque viene de promediar cuadrados, lo que hace que las distancias grandes pesen más. Pero tiene la misma escala que los datos, y por eso es la medida de dispersión que se reporta junto a la media: "la frecuencia media fue 67 lpm con desviación estándar de 6.6 lpm" describe tanto el centro como el ancho del grupo con dos números en las mismas unidades.

## Definición

:::definicion[Desviación estándar muestral]
Para datos $x_1, \dots, x_n$ con $n \ge 2$,
$$
s = \sqrt{s^2} = \sqrt{\frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar{x})^2}.
$$
La desviación estándar de una población es $\sigma = \sqrt{\sigma^2}$.
:::

Se usa el mismo denominador $n - 1$ que en la varianza. La desviación estándar es siempre no negativa y tiene las unidades de los datos.

:::figura[La banda sombreada va de la media menos una desviación estándar a la media más una, para el tiempo que tardan ocho trenes en recorrer la misma ruta.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [42, 45, 44, 47, 43, 49, 46, 40]
medida: desviacion
lecturas: [desviacion]
banda: true
variable: Duración del recorrido
unidad: min
decimales: 0
dominio: [37, 52]
```
:::

:::nota[Qué significa cada símbolo]
- $s$: desviación estándar muestral.
- $s^2$: varianza muestral.
- $x_i$: observación $i$.
- $\bar{x}$: media muestral.
- $n$: número de observaciones.
- $\sigma$, $\sigma^2$: desviación estándar y varianza de la población.
- $\sqrt{\cdot}$: raíz cuadrada positiva.
:::

## Cómo usar la visualización

Cada fila es un corredor; los segmentos son sus desviaciones respecto a la media. El encabezado acumula los cuadrados de esas desviaciones dentro de la raíz. Al terminar, aparece una banda que cubre la media más y menos una desviación estándar.

La mayoría de los corredores queda dentro de la banda y unos pocos fuera. Al arrastrar el corredor de 80 lpm hasta la media, la banda se estrecha notablemente: un solo valor lejano aporta mucho a la desviación estándar. Al alejar dos corredores en direcciones opuestas, la banda se ensancha aunque la media no cambie.

## Ejemplo

Una máquina corta tornillos que deberían medir 10 mm. Seis tornillos midieron 10.2, 9.8, 10.1, 9.9, 10.4 y 9.6 mm.

1. Media: $\bar{x} = 60/6 = 10$ mm.
2. Desviaciones: $0.2, -0.2, 0.1, -0.1, 0.4, -0.4$.
3. Cuadrados: $0.04, 0.04, 0.01, 0.01, 0.16, 0.16$; suma $0.42$ mm².
4. Varianza: $s^2 = 0.42 / 5 = 0.084$ mm².
5. Desviación estándar: $s = \sqrt{0.084} \approx 0.29$ mm. Los tornillos suelen desviarse unas tres décimas de milímetro de la media.

:::figura[Los seis tornillos del ejemplo con la banda de una desviación estándar alrededor de 10 mm.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [10.2, 9.8, 10.1, 9.9, 10.4, 9.6]
medida: desviacion
lecturas: [desviacion, varianza]
banda: true
variable: Longitud del tornillo
unidad: mm
decimales: 1
dominio: [9.4, 10.6]
```
:::

## Propiedades

- **Escala:** si $y_i = a + b x_i$, entonces $s_y = |b|\,s_x$. A diferencia de la varianza, se multiplica por $|b|$, no por $b^2$.
- **Regla empírica:** en datos con forma de campana, alrededor de 68 % de las observaciones cae a menos de una desviación estándar de la media y alrededor de 95 % a menos de dos.
- **Cota general:** para cualquier forma de los datos, la desigualdad de Chebyshev garantiza que al menos $1 - 1/k^2$ de las observaciones están a menos de $k$ desviaciones estándar de la media.
- **Sensible a extremos**, igual que la varianza.

:::figura[Propiedad de la regla empírica con las estaturas de 24 estudiantes: 18 de 24, el 75 %, quedan dentro de la banda de una desviación estándar, cerca del 68 % que se espera con datos en forma de campana.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [168, 174, 168, 167, 163, 168, 179, 173, 178, 172, 173, 171, 157, 177, 174, 174, 156, 156, 163, 166, 172, 170, 174, 165]
medida: desviacion
lecturas: [desviacion]
banda: true
variable: Estatura
unidad: cm
decimales: 0
dominio: [152, 183]
```
:::

## Errores comunes

- **Confundirla con el error estándar.** La desviación estándar describe la dispersión de los datos; el error estándar $s/\sqrt{n}$ describe la incertidumbre de la media. Con más datos, $s$ se estabiliza y el error estándar disminuye.
- **Comparar desviaciones estándar de variables con escalas distintas.** Una desviación de 5 kg es enorme para recién nacidos y pequeña para adultos; para comparar se usa el [[coeficiente-de-variacion]].
- **Pensar que todos los datos están a una desviación estándar de la media.** Es una distancia típica; en datos con forma de campana, casi un tercio de las observaciones queda fuera de la banda.

:::figura[Escalas distintas: pesos de adultos y de recién nacidos. La desviación estándar de los adultos es unas 23 veces mayor, pero en relación con su media ambos grupos varían de forma parecida.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [62, 70, 75, 68, 80]
medida: desviacion
lecturas: [desviacion, cv]
banda: true
variable: Peso de adultos
unidad: kg
decimales: 0
comparar:
  datos: [3.1, 3.4, 2.8, 3.6, 3.3]
  variable: Peso al nacer
  unidad: kg
```
:::

## Conexiones

La desviación estándar es la raíz de la [[varianza-muestral]] y comparte su denominador, explicado por la [[correccion-de-bessel]]. Dividirla entre la media da el [[coeficiente-de-variacion]], y usarla como unidad de medida produce las [[puntuaciones-z-muestrales]]. Las alternativas robustas son la [[desviacion-absoluta-mediana]] y el [[rango-intercuartilico]]. En probabilidad, $\sigma$ es el parámetro de escala de la distribución normal.

## Formulario

:::formula[Desviación estándar muestral]
$$
s = \sqrt{\frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar{x})^2}
$$

- $x_i$: observaciones; $\bar{x}$: media.
- $n$: número de observaciones.
:::

:::formula[Transformación lineal]
$$
y_i = a + b\,x_i \ \Longrightarrow\ s_y = |b|\,s_x
$$

- $a$: desplazamiento, sin efecto.
- $b$: cambio de escala.
:::

:::formula[Desigualdad de Chebyshev para datos]
$$
\frac{\#\{i : |x_i - \bar{x}| < k\,s\}}{n} \ge 1 - \frac{1}{k^2}, \qquad k > 1
$$

- $k$: número de desviaciones estándar.
- $\#\{\cdot\}$: número de observaciones que cumplen la condición.
:::

:::formula[Error estándar de la media]
$$
\mathrm{EE} = \frac{s}{\sqrt{n}}
$$

- $\mathrm{EE}$: error estándar, la dispersión de la media muestral entre muestras.
:::
