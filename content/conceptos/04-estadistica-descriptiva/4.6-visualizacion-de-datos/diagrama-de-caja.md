---
id: diagrama-de-caja
titulo: Diagrama de caja
titulo_en: Box plot
alias:
  - diagrama de caja y bigotes
  - boxplot
  - gráfico de caja
modulo: 4
submodulo: '4.6'
orden: 3
nivel: basico
prerrequisitos:
  - resumen-de-cinco-numeros
etiquetas:
  - visualización
  - comparación de grupos
  - cuartiles
  - valores atípicos
resumen: >
  El diagrama de caja dibuja la mediana, los cuartiles, los bigotes y los atípicos de un conjunto de
  datos. Su fuerza es comparar varios grupos en un mismo eje con muy poco espacio.
formula: '\big[Q_1,\ Q_3\big] \text{ caja}, \qquad \big[Q_1 - 1.5\,\mathrm{RIQ},\ Q_3 + 1.5\,\mathrm{RIQ}\big] \text{ vallas}'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: cajas
    puntos: true
    grupos:
      - nombre: Hospital Norte
        forma: sesgo-derecha
        parametro: 3
        centro: 35
        escala: 12
        n: 60
        decimales: 0
      - nombre: Hospital Centro
        forma: normal
        centro: 48
        escala: 10
        n: 60
        decimales: 0
      - nombre: Hospital Sur
        forma: sesgo-derecha
        parametro: 6
        centro: 28
        escala: 8
        n: 60
        decimales: 0
    eje:
      variable: Espera en urgencias
      unidad: min
referencias:
  - clave: tufte
  - clave: degroot
publicado: true
---

## Intuición

Para comparar los tiempos de espera en urgencias de tres hospitales, se podrían dibujar tres histogramas, pero ocuparían mucho espacio y sería difícil compararlos de un vistazo. El **diagrama de caja** resume cada hospital en una figura compacta: una caja que abarca la mitad central de los datos, una línea en la mediana, unos bigotes que llegan hasta los datos más extremos que no son atípicos, y puntos sueltos para los atípicos.

Puestos uno junto a otro sobre el mismo eje, los diagramas de caja permiten responder en segundos qué grupo tiene el valor típico más alto (la mediana más a la derecha), cuál es más variable (la caja más ancha), cuál tiene la cola más larga (el bigote más largo de un lado) y dónde hay casos extremos. Esa capacidad de comparar es su mayor ventaja. Su mayor limitación es lo que no muestra: cuántos datos hay y si la distribución tiene más de un pico.

## Definición

:::definicion[Diagrama de caja de Tukey]
Para cada grupo se calculan los cuartiles $Q_1$, $\tilde{x}$ y $Q_3$ y el rango intercuartílico $\mathrm{RIQ} = Q_3 - Q_1$. Se dibuja:

1. una **caja** de $Q_1$ a $Q_3$ con una línea en la mediana $\tilde{x}$;
2. **bigotes** desde la caja hasta el dato más extremo dentro de las vallas $Q_1 - 1.5\,\mathrm{RIQ}$ y $Q_3 + 1.5\,\mathrm{RIQ}$;
3. cada dato fuera de las vallas como un punto **atípico**.
:::

Existen variantes: bigotes hasta el mínimo y el máximo, hasta los percentiles 5 y 95, o con una muesca alrededor de la mediana que indica su incertidumbre. Siempre conviene decir cuál se usa.

:::figura[Un solo grupo con atípicos: 40 tiempos de carga de una página web. La caja es estrecha y los puntos aislados a la derecha marcan cargas muy lentas.]{componente="ChartGallery"}
```yaml
grafico: cajas
puntos: true
grupos:
  - nombre: Página principal
    forma: colas-pesadas
    parametro: 3
    centro: 2.4
    escala: 0.4
    n: 40
    decimales: 2
eje:
  variable: Tiempo de carga
  unidad: s
```
:::

:::nota[Qué significa cada símbolo]
- $Q_1$, $Q_3$: primer y tercer cuartil.
- $\tilde{x}$: mediana.
- $\mathrm{RIQ} = Q_3 - Q_1$: rango intercuartílico, ancho de la caja.
- $Q_1 - 1.5\,\mathrm{RIQ}$ y $Q_3 + 1.5\,\mathrm{RIQ}$: vallas inferior y superior.
- $1.5$: constante usual de Tukey.
:::

## Cómo usar la visualización

Tres hospitales con 60 pacientes cada uno. Primero aparecen los puntos de cada grupo dispersos verticalmente para no encimarse; después se dibujan las cajas sobre ellos. El encabezado muestra las tres medianas y el panel, la mediana y el rango intercuartílico de cada hospital.

El Hospital Centro tiene la mediana más alta; el Norte, la caja más ancha y un bigote derecho largo, señal de esperas muy largas en algunos casos. Comparar las cajas con los puntos de fondo muestra qué se pierde al resumir: el número de pacientes y los detalles de la forma.

## Ejemplo

Dos líneas de producción llenan botellas; se miden diez botellas de cada una (mL por encima de 450): línea A, 48, 52, 55, 57, 58, 60, 61, 63, 66, 70; línea B, 40, 45, 51, 53, 54, 56, 58, 64, 71, 78.

1. Línea A: mínimo 48, $Q_1 = 55.5$, mediana 59, $Q_3 = 62.5$, máximo 70; $\mathrm{RIQ} = 7$.
2. Línea B: mínimo 40, $Q_1 = 51.5$, mediana 55, $Q_3 = 62.5$, máximo 78; $\mathrm{RIQ} = 11$.
3. Vallas de B: $51.5 - 16.5 = 35$ y $62.5 + 16.5 = 79$; no hay atípicos.
4. Comparación: A llena un poco más y con menos variación; B tiene una caja más ancha y bigotes más largos.

:::figura[Las dos líneas del ejemplo con sus diez botellas.]{componente="ChartGallery"}
```yaml
grafico: cajas
puntos: true
grupos:
  - nombre: Línea A
    valores: [48, 52, 55, 57, 58, 60, 61, 63, 66, 70]
  - nombre: Línea B
    valores: [40, 45, 51, 53, 54, 56, 58, 64, 71, 78]
eje:
  variable: Llenado sobre 450
  unidad: mL
```
:::

## Propiedades

- **Comparación compacta:** varias cajas en un mismo eje muestran diferencias de centro, dispersión y simetría.
- **Asimetría visible:** si la mediana no está en el centro de la caja o un bigote es más largo, la distribución es asimétrica.
- **Resistencia:** la caja y la mediana no se mueven por los atípicos; solo los puntos sueltos los reflejan.
- **Bajo normalidad**, las vallas de Tukey dejan fuera alrededor de 0.7 % de los datos, de modo que en muestras grandes siempre aparecen algunos atípicos.

:::figura[Propiedad de los atípicos en muestras grandes: 1000 datos normales de presión arterial. Aunque la población no tiene ningún dato anómalo, aparecen varios puntos fuera de las vallas.]{componente="ChartGallery"}
```yaml
grafico: cajas
grupos:
  - nombre: Adultos sanos
    forma: normal
    centro: 120
    escala: 12
    n: 1000
    decimales: 0
eje:
  variable: Presión sistólica
  unidad: mmHg
```
:::

## Errores comunes

- **No mostrar el tamaño de cada grupo.** Una caja de 5 datos y una de 500 se ven igual de sólidas.
- **Ocultar la multimodalidad.** Un grupo con dos picos produce una caja ancha y simétrica que no lo delata; los puntos o un violín lo revelan.
- **Eliminar automáticamente los puntos atípicos.** Que un dato quede fuera de las vallas es una señal para revisarlo, no una prueba de que sea un error.

:::figura[Una caja que oculta dos grupos: tiempos de un trámite que unas oficinas resuelven en línea y otras en ventanilla. La caja de "Mixto" es ancha y simétrica; solo los puntos muestran los dos montones.]{componente="ChartGallery"}
```yaml
grafico: cajas
puntos: true
grupos:
  - nombre: En línea
    forma: normal
    centro: 15
    escala: 3
    n: 60
    decimales: 0
  - nombre: Mixto
    forma: mezcla
    parametro: 5
    centro: 25
    escala: 3
    n: 60
    decimales: 0
eje:
  variable: Duración del trámite
  unidad: min
```
:::

## Conexiones

El diagrama de caja dibuja el [[resumen-de-cinco-numeros]] con las vallas basadas en el [[rango-intercuartilico]]. El [[diagrama-de-violin]] añade la forma completa de la distribución, y los [[graficos-de-enjambre-y-de-franjas]] muestran todos los puntos. Las vallas de Tukey son la base de la detección de valores atípicos por rango intercuartílico.

## Formulario

:::formula[Caja]
$$
[Q_1,\ Q_3], \qquad \mathrm{RIQ} = Q_3 - Q_1
$$

- $Q_1$, $Q_3$: cuartiles.
:::

:::formula[Vallas de Tukey]
$$
L = Q_1 - 1.5\,\mathrm{RIQ}, \qquad U = Q_3 + 1.5\,\mathrm{RIQ}
$$

- $L$, $U$: valla inferior y superior.
:::

:::formula[Proporción fuera de las vallas en una normal]
$$
P\big(X \notin [L, U]\big) \approx 0.007
$$

- $X$: variable normal; las vallas quedan a unas 2.7 desviaciones estándar de la media.
:::
