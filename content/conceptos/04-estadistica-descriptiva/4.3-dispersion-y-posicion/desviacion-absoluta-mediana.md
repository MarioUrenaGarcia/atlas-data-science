---
id: desviacion-absoluta-mediana
titulo: Desviación absoluta mediana (MAD)
titulo_en: Median absolute deviation
alias:
  - MAD
  - desviación mediana absoluta
modulo: 4
submodulo: '4.3'
orden: 9
nivel: basico
prerrequisitos:
  - mediana
  - desviacion-estandar-muestral
relaciones:
  - tipo: contrasta
    id: desviacion-absoluta-media
etiquetas:
  - dispersión
  - estadística robusta
  - mediana
  - valores atípicos
resumen: >
  La MAD es la mediana de las distancias de los datos a su mediana. Es la medida de dispersión más
  resistente a valores atípicos; multiplicada por 1.4826 estima la desviación estándar de datos normales.
formula: '\mathrm{MAD} = \operatorname{mediana}_i\,\big|x_i - \tilde{x}\big|'
visualizacion:
  componente: DataStrip
  parametros:
    modo: dispersion
    datos: [42, 45, 44, 47, 43, 46, 95]
    medida: mad
    lecturas: [mad, desviacion, riq]
    variable: Latencia de red
    unidad: ms
    decimales: 0
referencias:
  - clave: wasserman
publicado: true
---

## Intuición

Un servidor responde siete solicitudes en 42, 45, 44, 47, 43, 46 y 95 milisegundos; la última coincidió con una falla momentánea. La desviación estándar, unos 19 ms, sugiere que las latencias son muy variables, cuando seis de las siete están en un intervalo de 5 ms. Una sola falla basta para engañarla.

La **desviación absoluta mediana** repite la idea de la desviación estándar, pero con piezas resistentes: mide la distancia de cada dato al centro, usando la mediana en lugar de la media, y resume esas distancias con otra mediana en lugar de un promedio de cuadrados. La falla queda a 50 ms del centro, pero es una sola distancia grande entre siete; la mediana de las distancias la ignora y dice que la latencia típica se aleja unos 2 ms de la central. Es la medida preferida cuando se sospecha que hay datos contaminados y se quiere describir el comportamiento de la mayoría.

## Definición

:::definicion[Desviación absoluta mediana]
Sea $\tilde{x}$ la mediana de los datos. La **desviación absoluta mediana** es
$$
\mathrm{MAD} = \operatorname{mediana}\big\{|x_1 - \tilde{x}|, \dots, |x_n - \tilde{x}|\big\}.
$$
La versión escalada $\mathrm{MAD}_N = 1.4826 \cdot \mathrm{MAD}$ estima la desviación estándar cuando los datos provienen de una distribución normal.
:::

El factor $1.4826 \approx 1/\Phi^{-1}(3/4)$ viene de que, en una normal, la mitad de los datos está a menos de $0.6745\,\sigma$ de la mediana.

:::figura[MAD de las horas de sueño de nueve estudiantes: primero se marcan las distancias a la mediana y después se toma la mediana de esas distancias.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [6.5, 7.0, 7.5, 6.0, 8.0, 7.0, 5.5, 7.5, 3.0]
medida: mad
lecturas: [mad, desviacion]
variable: Horas de sueño
unidad: h
decimales: 1
```
:::

:::nota[Qué significa cada símbolo]
- $\mathrm{MAD}$: desviación absoluta mediana.
- $x_i$: observación $i$; $n$: número de observaciones.
- $\tilde{x}$: mediana de los datos.
- $|x_i - \tilde{x}|$: distancia de la observación $i$ a la mediana.
- $\mathrm{MAD}_N$: versión escalada, comparable con la desviación estándar.
- $\Phi^{-1}$: función cuantil de la normal estándar; $\Phi^{-1}(3/4) \approx 0.6745$.
:::

## Cómo usar la visualización

Cada fila es una solicitud. Las desviaciones se dibujan desde la mediana, no desde la media. El encabezado lista las distancias absolutas conforme aparecen y, al final, las ordena y toma su mediana. El panel compara la MAD con la desviación estándar y el rango intercuartílico.

Con la falla de 95 ms, la MAD vale 2 ms y la desviación estándar más de 19 ms. Al arrastrar la falla de regreso a 48 ms, la desviación estándar se desploma y la MAD sigue en 2: la MAD ya describía bien a la mayoría desde el principio. Para mover la MAD hay que desplazar más de la mitad de los datos.

## Ejemplo

Los tiempos, en minutos, que siete pacientes esperaron en un laboratorio fueron 12, 14, 15, 15, 17, 20 y 31.

1. Mediana: $\tilde{x} = 15$.
2. Distancias absolutas: $|12 - 15| = 3$, $1$, $0$, $0$, $2$, $5$ y $|31 - 15| = 16$.
3. Distancias ordenadas: 0, 0, 1, 2, 3, 5, 16. Su mediana es el cuarto valor: $\mathrm{MAD} = 2$ minutos.
4. Versión escalada: $1.4826 \cdot 2 \approx 2.97$ minutos.
5. La desviación estándar de los mismos datos es unos 6.3 minutos, inflada por el paciente que esperó 31.

:::figura[Las esperas del ejemplo: la MAD de 2 minutos frente a la desviación estándar de unos 6.3.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [12, 14, 15, 15, 17, 20, 31]
medida: mad
lecturas: [mad, desviacion]
variable: Espera en el laboratorio
unidad: min
decimales: 0
```
:::

## Propiedades

- **Punto de ruptura de 50 %:** es la máxima resistencia posible para una medida de dispersión.
- **Equivarianza:** si $y_i = a + b x_i$, la MAD de las $y$ es $|b|$ veces la de las $x$.
- **Escalada estima $\sigma$:** con datos normales, $1.4826\,\mathrm{MAD}$ se acerca a la desviación estándar, aunque con más variabilidad que $s$.
- **Base de la puntuación z modificada:** $0.6745\,(x_i - \tilde{x})/\mathrm{MAD}$ se usa para detectar atípicos sin que estos alteren la escala.

:::figura[Propiedad de resistencia: las latencias con y sin la falla. La MAD es 2 ms en ambos casos.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [42, 45, 44, 47, 43, 46, 95]
medida: mad
lecturas: [mad, desviacion]
variable: Con la falla
unidad: ms
decimales: 0
comparar:
  datos: [42, 45, 44, 47, 43, 46, 48]
  variable: Sin la falla
  unidad: ms
```
:::

## Errores comunes

- **Confundir las siglas.** "MAD" a veces se usa para la desviación absoluta media, que promedia las distancias a la media y no es resistente.
- **Compararla sin escalar con la desviación estándar.** Para datos normales la MAD es cerca de dos tercios de $\sigma$; antes de comparar se multiplica por 1.4826.
- **Usarla con datos muy discretos.** Si más de la mitad de los datos son iguales a la mediana, la MAD vale cero aunque haya variación.

:::figura[MAD frente a desviación absoluta media en las esperas del laboratorio: la media de las distancias a la media, 4.45 minutos, es más del doble de la MAD, por el paciente de 31 minutos.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [12, 14, 15, 15, 17, 20, 31]
medida: dam
lecturas: [dam, mad]
variable: Espera en el laboratorio
unidad: min
decimales: 0
```
:::

## Conexiones

La MAD aplica la [[mediana]] dos veces y es la contraparte robusta de la [[desviacion-estandar-muestral]]. Se contrasta con la [[desviacion-absoluta-media]], que usa promedios, y comparte con el [[rango-intercuartilico]] la resistencia a extremos. Su versión escalada define la puntuación z modificada para detectar valores atípicos.

## Formulario

:::formula[Desviación absoluta mediana]
$$
\mathrm{MAD} = \operatorname{mediana}_i\,|x_i - \tilde{x}|
$$

- $x_i$: observaciones.
- $\tilde{x}$: mediana de las observaciones.
:::

:::formula[Versión escalada]
$$
\mathrm{MAD}_N = 1.4826\,\mathrm{MAD} = \frac{\mathrm{MAD}}{\Phi^{-1}(3/4)}
$$

- $\Phi^{-1}(3/4) \approx 0.6745$: cuantil 0.75 de la normal estándar.
:::

:::formula[Puntuación z modificada]
$$
z_i^{*} = \frac{0.6745\,(x_i - \tilde{x})}{\mathrm{MAD}}
$$

- $z_i^{*}$: distancia de $x_i$ a la mediana medida en unidades comparables con desviaciones estándar.
:::
