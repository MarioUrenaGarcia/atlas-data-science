---
id: datos-discretos-y-continuos
titulo: Datos discretos y continuos
titulo_en: Discrete and continuous data
alias:
  - variable discreta
  - variable continua
  - conteos y mediciones
modulo: 4
submodulo: '4.1'
orden: 4
nivel: basico
prerrequisitos:
  - datos-cualitativos-y-cuantitativos
  - cardinalidad-finita-numerable-y-no-numerable
etiquetas:
  - variable discreta
  - variable continua
  - conteo
  - medición
  - resolución
resumen: >
  Una variable cuantitativa es discreta si sus valores posibles se pueden enumerar, como los conteos,
  y continua si puede tomar cualquier valor de un intervalo, como las mediciones.
formula: 'x_i \in \{0, 1, 2, \dots\} \quad\text{frente a}\quad x_i \in [a, b] \subseteq \mathbb{R}'
visualizacion:
  componente: DataTypesViz
  parametros:
    modo: valores
    discreta:
      nombre: Pasajeros en el vagón
      unidad: personas
      desde: 37
    continua:
      nombre: Peso del equipaje
      unidad: kg
      desde: 18
      valor: 18.46293
referencias:
  - clave: degroot
  - clave: blitzstein-hwang
    capitulo: '3'
publicado: true
---

## Intuición

Contar y medir son actos distintos. Al contar pasajeros que suben a un vagón, los resultados posibles son 36, 37 o 38; no existe un vagón con 37.4 pasajeros. Entre dos conteos consecutivos no hay nada. Al pesar una maleta, en cambio, la báscula puede marcar 18.4 kg, y una báscula más fina diría 18.46 kg, y otra aún más fina 18.463 kg. Entre dos pesos cualesquiera siempre cabe otro.

Esa diferencia define a las variables **discretas** y **continuas**. Las discretas saltan de un valor posible al siguiente; las continuas llenan intervalos completos. La distinción importa porque cambia la manera de describir los datos y de modelarlos: para una variable discreta tiene sentido preguntar por la probabilidad de un valor exacto, como la de que suban exactamente 37 pasajeros; para una continua esa pregunta se sustituye por la probabilidad de un intervalo, como la de que la maleta pese entre 18 y 19 kg.

## Definición

:::definicion[Variable discreta y continua]
Una variable cuantitativa es **discreta** si el conjunto de sus valores posibles es finito o numerable, es decir, se puede listar como $v_1, v_2, v_3, \dots$ Los conteos, con valores en $\{0, 1, 2, \dots\}$, son el caso típico.

Una variable cuantitativa es **continua** si puede tomar cualquier valor de un intervalo $[a, b] \subseteq \mathbb{R}$ (o de una unión de intervalos). Las mediciones de longitud, peso, tiempo y temperatura son el caso típico.
:::

En la práctica toda medición se registra con una resolución finita (milímetros, gramos, segundos), así que los datos guardados son técnicamente discretos. La clasificación se refiere a la magnitud que se mide: si una medición más fina podría dar un valor intermedio, la variable es continua.

:::figura[Variables de un sistema de transporte clasificadas como discretas o continuas.]{componente="DataTypesViz"}
```yaml
modo: clasificar
eje: medida
ejemplos:
  - nombre: Autobuses en servicio
    valores: 42, 45, 39
    clase: discreto
    razon: Se cuentan; no hay 42.5 autobuses.
  - nombre: Tiempo de recorrido
    valores: 37.2, 41.8 min
    clase: continuo
    razon: Un cronómetro más fino daría más decimales.
  - nombre: Paradas por ruta
    valores: 18, 22, 31
    clase: discreto
    razon: Es un conteo de paradas.
  - nombre: Distancia recorrida
    valores: 12.6, 14.03 km
    clase: continuo
    razon: Es una longitud.
  - nombre: Consumo de diésel
    valores: 31.4, 29.9 L
    clase: continuo
    razon: Es un volumen.
  - nombre: Retrasos en el día
    valores: 0, 3, 7
    clase: discreto
    razon: Se cuentan los eventos de retraso.
```
:::

:::nota[Qué significa cada símbolo]
- $x_i$: valor de la variable en la unidad $i$.
- $\{0, 1, 2, \dots\}$: conjunto de los enteros no negativos, valores posibles de un conteo.
- $[a, b]$: intervalo de números reales entre $a$ y $b$, incluidos los extremos.
- $\subseteq \mathbb{R}$: subconjunto de los números reales.
- $v_1, v_2, \dots$: lista de los valores posibles de una variable discreta.
:::

## Cómo usar la visualización

La franja superior muestra los valores posibles del número de pasajeros; la inferior, los del peso del equipaje. La reproducción hace zoom diez veces en cada paso sobre la misma región de ambas variables. El panel indica el ancho de la ventana y cuántos valores posibles caben en ella.

En la franja discreta, después del segundo acercamiento ya no queda ningún valor posible: entre 37 y 38 pasajeros no hay nada. En la franja continua, cada acercamiento revela nuevas marcas en el eje y la lectura de la medición gana un decimal; el número de valores posibles sigue siendo infinito a cualquier escala.

## Ejemplo

Una estación meteorológica registra cada día cinco variables. Se clasifican preguntando si entre dos valores posibles cabe otro.

1. **Temperatura máxima** (27.3 °C): entre 27.3 y 27.4 cabe 27.35. Continua.
2. **Lluvia acumulada** (4.2 mm): es una altura de agua. Continua.
3. **Horas con lluvia** contadas en horas completas (0, 1, 2, ..., 24): discreta, con 25 valores posibles.
4. **Número de rayos detectados** (0, 12, 57): conteo sin límite superior fijo. Discreta, con valores numerables.
5. **Velocidad del viento** (14.8 km/h): continua.

Para las variables discretas se puede reportar, por ejemplo, que en 9 de 30 días hubo exactamente 0 rayos. Para las continuas se reportan intervalos: en 12 de 30 días la temperatura máxima estuvo entre 27 y 29 °C, porque la frecuencia de un valor exacto como 27.300 °C no es informativa.

:::figura[La misma idea con otra pareja de variables del ejemplo: horas con lluvia, un conteo, frente a lluvia acumulada, una medición.]{componente="DataTypesViz"}
```yaml
modo: valores
discreta:
  nombre: Horas con lluvia
  unidad: horas
  desde: 5
continua:
  nombre: Lluvia acumulada
  unidad: mm
  desde: 4
  valor: 4.2186
```
:::

## Propiedades

- **Conjunto de valores.** Una variable discreta tiene a lo más una cantidad numerable de valores posibles; una continua tiene una cantidad no numerable, como cualquier intervalo de la recta.
- **Probabilidades de valores exactos.** Para una variable discreta, un valor exacto puede tener probabilidad positiva; para una continua, cada valor exacto tiene probabilidad cero y solo los intervalos tienen probabilidad positiva.
- **Gráficos adecuados.** Una variable discreta con pocos valores se representa con barras separadas por valor; una continua, con histogramas de intervalos contiguos o curvas de densidad.
- **Resolución y redondeo.** Una variable continua medida con poca resolución produce muchos empates y se comporta en los datos como discreta.

:::figura[Propiedad del conjunto de valores con un tercer par de variables: llamadas recibidas en una hora frente al tiempo entre dos llamadas.]{componente="DataTypesViz"}
```yaml
modo: valores
discreta:
  nombre: Llamadas en una hora
  unidad: llamadas
  desde: 11
continua:
  nombre: Tiempo entre llamadas
  unidad: min
  desde: 5
  valor: 5.37421
```
:::

## Errores comunes

- **Llamar discreta a una variable solo porque se registró redondeada.** La edad en años cumplidos toma valores enteros, pero la edad es una magnitud continua; el redondeo es una decisión de registro.
- **Llamar continua a una variable solo porque toma muchos valores.** El número de habitantes de un municipio puede ir de cientos a millones, pero sigue siendo un conteo. Con tantos valores suele tratarse como si fuera continua por comodidad, lo cual es una aproximación, no un cambio de tipo.
- **Aplicar el concepto a variables cualitativas.** "Discreta o continua" solo se pregunta de variables cuantitativas; el tipo de sangre no es discreto ni continuo, es categórico.

:::figura[Casos que suelen clasificarse mal: variables registradas como enteros que son continuas y conteos con muchos valores posibles.]{componente="DataTypesViz"}
```yaml
modo: clasificar
eje: medida
ejemplos:
  - nombre: Edad en años cumplidos
    valores: 18, 19, 45
    clase: continuo
    razon: La edad crece de forma continua; registrarla en años completos es un redondeo.
  - nombre: Habitantes del municipio
    valores: 3812, 1,302,450
    clase: discreto
    razon: Es un conteo de personas, aunque tome millones de valores.
  - nombre: Precio en pesos
    valores: 19.90, 249.00
    clase: discreto
    razon: Se expresa en centavos, una unidad mínima indivisible; con montos grandes se aproxima como continua.
  - nombre: Peso al nacer registrado en gramos
    valores: 3120, 2985
    clase: continuo
    razon: El peso es una magnitud continua medida con resolución de un gramo.
```
:::

## Conexiones

Esta clasificación divide a las variables cuantitativas de [[datos-cualitativos-y-cuantitativos]]. El conjunto de valores posibles se describe con la noción de [[cardinalidad-finita-numerable-y-no-numerable|cardinalidad]]: finito o numerable para las discretas, no numerable para las continuas. La distinción reaparece en la forma de graficar y resumir los datos, y es la base de la diferencia entre variables aleatorias discretas y continuas en probabilidad. Las [[escalas-nominal-ordinal-de-intervalo-y-de-razon|escalas de medición]] clasifican las mismas variables desde otro ángulo: qué comparaciones admiten.

## Formulario

:::formula[Variable discreta]
$$
x_i \in \{v_1, v_2, v_3, \dots\}
$$

- $x_i$: valor de la unidad $i$.
- $v_1, v_2, \dots$: valores posibles, en cantidad finita o numerable.
:::

:::formula[Conteo]
$$
x_i \in \{0, 1, 2, \dots\}
$$

- $x_i$: número de eventos u objetos contados en la unidad $i$.
:::

:::formula[Variable continua]
$$
x_i \in [a, b] \subseteq \mathbb{R}
$$

- $[a, b]$: intervalo de valores posibles.
- $a, b$: extremos del intervalo.
- $\mathbb{R}$: números reales.
:::
