---
id: asimetria-muestral
titulo: Asimetría muestral
titulo_en: Sample skewness
alias:
  - sesgo
  - coeficiente de asimetría
  - skewness
modulo: 4
submodulo: '4.4'
orden: 1
nivel: basico
prerrequisitos:
  - desviacion-estandar-muestral
  - mediana
etiquetas:
  - forma de la distribución
  - asimetría
  - cola larga
  - tercer momento
resumen: >
  La asimetría muestral mide si los datos tienen una cola más larga hacia un lado. Es positiva con cola
  a la derecha, negativa con cola a la izquierda y cercana a cero en datos simétricos.
formula: 'g_1 = \frac{m_3}{m_2^{3/2}}, \qquad m_k = \frac{1}{n}\sum_{i=1}^{n}(x_i - \bar{x})^k'
visualizacion:
  componente: DataStrip
  parametros:
    modo: forma
    enfoque: asimetria
    forma: sesgo-derecha
    formas: [sesgo-derecha, sesgo-izquierda]
    parametro: 2
    centro: 30
    escala: 8
    variable: Tiempo de espera en una clínica
    unidad: min
referencias:
  - clave: degroot
  - clave: wasserman
publicado: true
---

## Intuición

Los tiempos de espera en una clínica casi nunca son simétricos. La mayoría de los pacientes espera entre 20 y 35 minutos, nadie espera menos de cero, y unos pocos esperan una hora o más. El histograma tiene un cuerpo cargado a la izquierda y una cola que se estira hacia la derecha. Esa forma se llama **asimetría positiva** o cola a la derecha.

La asimetría importa porque cambia el significado de los resúmenes: en datos con cola a la derecha, la media se va hacia la cola y queda por encima de la mediana, y la desviación estándar describe mal un lado y el otro. El **coeficiente de asimetría** convierte esa forma en un número. Eleva al cubo las desviaciones respecto a la media: al cubo, una desviación conserva su signo, y las grandes pesan mucho más que las pequeñas. Si la cola derecha es más larga, los cubos positivos dominan y el coeficiente es positivo; si la cola larga está a la izquierda, es negativo.

## Definición

:::definicion[Asimetría muestral]
Con los momentos centrales muestrales $m_k = \frac{1}{n}\sum_{i=1}^{n}(x_i - \bar{x})^k$, el **coeficiente de asimetría** es
$$
g_1 = \frac{m_3}{m_2^{3/2}}.
$$
La versión ajustada que reportan la mayoría de los programas, menos sesgada en muestras pequeñas, es
$$
G_1 = \frac{\sqrt{n(n-1)}}{n-2}\, g_1, \qquad n \ge 3.
$$
:::

No tiene unidades, porque divide un momento de orden 3 entre una potencia 3/2 de un momento de orden 2. Como guía informal, $|G_1| < 0.5$ suele leerse como aproximadamente simétrico y $|G_1| > 1$ como claramente asimétrico.

:::figura[Una población simétrica: 400 estaturas en forma de campana. El coeficiente de asimetría oscila cerca de cero mientras la muestra crece, y la media y la mediana casi coinciden.]{componente="DataStrip"}
```yaml
modo: forma
enfoque: asimetria
forma: normal
centro: 165
escala: 7
variable: Estatura
unidad: cm
```
:::

:::nota[Qué significa cada símbolo]
- $g_1$: coeficiente de asimetría basado en momentos.
- $G_1$: coeficiente ajustado por tamaño de muestra.
- $m_k$: momento central muestral de orden $k$, promedio de las desviaciones a la potencia $k$.
- $m_2$: varianza con denominador $n$; $m_3$: promedio de los cubos de las desviaciones.
- $x_i$: observaciones; $\bar{x}$: su media; $n$: número de datos.
:::

## Cómo usar la visualización

La muestra de tiempos de espera crece en lotes de 20 hasta 400 pacientes. El histograma se compara con una curva normal de la misma media y desviación estándar, y las líneas verticales marcan la media y la mediana. El encabezado calcula $G_1$ con los momentos de la muestra actual; el panel muestra también la asimetría de la población.

La media queda a la derecha de la mediana y el histograma sobrepasa a la normal en la cola derecha. Al subir la forma $k$ hasta 30, la población se vuelve casi simétrica y $G_1$ baja hacia cero. Al cambiar a "cola larga a la izquierda", la figura se refleja y el coeficiente cambia de signo.

## Ejemplo

Siete pacientes estuvieron hospitalizados 2, 3, 3, 4, 4, 5 y 9 días.

1. Media: $\bar{x} = 30/7 \approx 4.286$. Mediana: 4.
2. Desviaciones: $-2.286, -1.286, -1.286, -0.286, -0.286, 0.714, 4.714$.
3. $m_2 = \frac{1}{7}\sum (x_i - \bar{x})^2 \approx 4.490$ y $m_3 = \frac{1}{7}\sum (x_i - \bar{x})^3 \approx 12.70$. El cubo de la desviación del paciente de 9 días, $4.714^3 \approx 104.8$, domina la suma.
4. $g_1 = 12.70 / 4.490^{3/2} \approx 12.70 / 9.514 \approx 1.335$.
5. $G_1 = \frac{\sqrt{7 \cdot 6}}{5} \cdot 1.335 \approx 1.296 \cdot 1.335 \approx 1.73$: asimetría positiva marcada.

:::figura[Los siete días de hospitalización del ejemplo: la media queda a la derecha de la mediana, jalada por el paciente de 9 días.]{componente="DataStrip"}
```yaml
modo: centro
datos: [2, 3, 3, 4, 4, 5, 9]
medidas: [media, mediana]
variable: Días de hospitalización
unidad: días
decimales: 0
dominio: [0, 11]
```
:::

## Propiedades

- **Signo y cola:** $g_1 > 0$ indica cola más larga a la derecha; $g_1 < 0$, a la izquierda; en datos simétricos, $g_1 = 0$.
- **Invariante ante cambios de escala y de origen:** si $y_i = a + b x_i$ con $b > 0$, la asimetría no cambia; con $b < 0$ cambia de signo.
- **Media y mediana:** con frecuencia, cola a la derecha implica media mayor que mediana, aunque hay excepciones en distribuciones discretas o multimodales.
- **Muy sensible a extremos:** al usar cubos, un solo dato alejado puede determinar el signo y la magnitud del coeficiente.
- **Variabilidad muestral alta:** en datos normales, el error estándar de $G_1$ es aproximadamente $\sqrt{6/n}$; con 40 datos es cercano a 0.39.

:::figura[Efecto de la forma de la población: los mismos tiempos con k = 30. La asimetría de la población es 2/√30 ≈ 0.37 y la muestra se ve casi simétrica.]{componente="DataStrip"}
```yaml
modo: forma
enfoque: asimetria
forma: sesgo-derecha
parametro: 30
centro: 30
escala: 8
variable: Tiempo de espera
unidad: min
```
:::

## Errores comunes

- **Confundir el lado de la asimetría.** "Asimetría positiva" o "a la derecha" se refiere a la cola, no a donde se amontonan los datos: en ingresos, el grueso está a la izquierda y la cola larga a la derecha.
- **Interpretar como asimetría la variación de muestras pequeñas.** Con pocos datos, una población simétrica puede dar $G_1$ de 0.5 o más solo por azar.
- **Asumir que media mayor que mediana siempre implica asimetría positiva.** Es lo habitual, pero no una regla matemática.

:::figura[Variación de muestras pequeñas: 40 datos de una población normal. Al reiniciar con distintas semillas, G1 puede salir positivo o negativo y lejos de cero aunque la población sea simétrica.]{componente="DataStrip"}
```yaml
modo: forma
enfoque: asimetria
forma: normal
n: 40
centro: 100
escala: 15
variable: Puntaje de una prueba
unidad: puntos
```
:::

## Conexiones

La asimetría se apoya en la [[desviacion-estandar-muestral]] para escalar y se lee junto con la relación entre [[media-aritmetica]] y [[mediana]]. Con la [[curtosis-muestral-y-exceso-de-curtosis|curtosis]] describe la forma de la distribución más allá del centro y la dispersión. Las transformaciones logarítmica y de raíz se usan para reducir la asimetría positiva antes de aplicar métodos que suponen simetría.

## Formulario

:::formula[Momentos centrales muestrales]
$$
m_k = \frac{1}{n}\sum_{i=1}^{n}(x_i - \bar{x})^k
$$

- $k$: orden del momento.
- $x_i$: observaciones; $\bar{x}$: su media; $n$: número de datos.
:::

:::formula[Coeficiente de asimetría]
$$
g_1 = \frac{m_3}{m_2^{3/2}}
$$

- $m_3$: tercer momento central; $m_2$: segundo momento central.
:::

:::formula[Asimetría ajustada]
$$
G_1 = \frac{\sqrt{n(n-1)}}{n-2}\,g_1
$$

- $n$: número de datos, al menos 3.
:::

:::formula[Error estándar aproximado bajo normalidad]
$$
\mathrm{EE}(G_1) \approx \sqrt{\frac{6}{n}}
$$

- Escala típica de la variación de $G_1$ entre muestras de una población normal.
:::
