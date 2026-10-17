---
id: calculo-del-tamano-de-muestra
titulo: Cálculo del tamaño de muestra
titulo_en: Sample size determination
alias:
  - tamaño de muestra
  - determinación del tamaño de muestra
  - fórmula de Cochran
modulo: 5
submodulo: '5.1'
orden: 22
nivel: basico
prerrequisitos:
  - factor-de-correccion-por-poblacion-finita
  - teorema-central-del-limite
  - normal-estandar-y-puntuacion-z
relaciones:
  - tipo: relacionado
    id: error-muestral-y-margen-de-error
  - tipo: relacionado
    id: efecto-de-diseno
etiquetas:
  - planeación de encuestas
  - margen de error
  - nivel de confianza
  - población finita
resumen: >
  Determina cuántas unidades hay que observar para estimar una media o una proporción con un margen de
  error y un nivel de confianza fijados de antemano, ajustando por población finita y por el diseño.
formula: 'n_0 = \frac{z_{1-\alpha/2}^2\,p(1-p)}{E^2}, \qquad n = \frac{n_0}{1 + n_0/N}'
visualizacion:
  componente: PrecisionPlanner
  parametros:
    modo: tamano
    tipo: proporcion
    p: 0.5
    margen: 0.04
    margenMaximo: 0.15
    confianza: 0.95
    N: 2000
    variable: Satisfacción con la atención
referencias:
  - clave: lohr
    capitulo: '2'
publicado: true
---

## Intuición

Un hospital quiere saber qué proporción de sus 2000 pacientes del último mes quedó satisfecha con la atención, y quiere que la estimación no se aleje más de 4 puntos porcentuales del valor real, con 95 % de confianza. ¿A cuántos pacientes debe entrevistar?

La pregunta se responde invirtiendo la fórmula del margen de error: en lugar de calcular el margen a partir de $n$, se fija el margen deseado y se despeja $n$. Hace falta anticipar la variabilidad de lo que se mide; para una proporción, el peor caso es 50 %, que da el tamaño más grande. Después se ajusta por dos cosas: si la población es pequeña, hacen falta menos entrevistas, porque cada una cubre una parte apreciable de ella; si el diseño usa conglomerados o pesos, hacen falta más. Y como no todos contestan, la muestra que se sortea debe ser mayor que la que se necesita al final.

## Definición

:::definicion[Tamaño de muestra para una proporción y para una media]
Para estimar una proporción con margen $E$ y confianza $1 - \alpha$ en una población infinita,
$$
n_0 = \frac{z_{1-\alpha/2}^2\,p(1-p)}{E^2},
$$
y para una media con desviación estándar anticipada $S$,
$$
n_0 = \left(\frac{z_{1-\alpha/2}\,S}{E}\right)^2.
$$
En una población de tamaño $N$, el tamaño ajustado es
$$
n = \frac{n_0}{1 + n_0/N},
$$
redondeado hacia arriba.
:::

Si el diseño tiene efecto de diseño $\text{deff}$, se usa $n_0 \cdot \text{deff}$ en lugar de $n_0$, y si se espera una tasa de respuesta $R$, se sortean $n/R$ unidades. Los valores $p$ y $S$ se anticipan con estudios previos, una prueba piloto o, para $p$, el valor conservador $0.5$.

:::nota[Qué significa cada símbolo]
- $E$: margen de error deseado, en las unidades de la variable o en proporción.
- $1 - \alpha$: nivel de confianza; $z_{1-\alpha/2}$: cuantil de la normal estándar.
- $p$: proporción anticipada; $S$: desviación estándar anticipada.
- $n_0$: tamaño para una población infinita; $N$: tamaño de la población.
- $n$: tamaño ajustado por población finita.
- $\text{deff}$: efecto de diseño; $R$: tasa de respuesta esperada.
:::

## Cómo usar la visualización

La curva naranja da el tamaño necesario para cada margen de error en una población infinita, y la azul el tamaño ajustado para los 2000 pacientes; el eje vertical es logarítmico. Al reproducir, el punto se desliza desde un margen amplio hasta el elegido y el encabezado hace el cálculo con los valores actuales.

Experimentos sugeridos:

- Reduce el margen de 0.04 a 0.02: el tamaño sin ajuste se cuadruplica.
- Compara las dos curvas: con márgenes pequeños, la población finita reduce mucho el tamaño necesario.
- Cambia la proporción anticipada a 0.1: se necesitan muchos menos pacientes que con 0.5.

## Ejemplo

El hospital de la visualización ($N = 2000$, $E = 0.04$, confianza 95 %, $p = 0.5$):

1. $n_0 = \frac{1.96^2 \cdot 0.5 \cdot 0.5}{0.04^2} = \frac{0.9604}{0.0016} = 600.25$.
2. Ajuste por población finita: $n = \frac{600.25}{1 + 600.25/2000} = \frac{600.25}{1.300} = 461.7$, así que $n = 462$.
3. Si se espera que responda el 70 % de los pacientes contactados, hay que sortear $462/0.7 = 660$.
4. Para estimar además el tiempo de espera promedio con margen de 2 minutos, si la desviación estándar es de unos 12 minutos: $n_0 = (1.96 \cdot 12/2)^2 = 138.3$, y con el ajuste, $n = 130$. Basta con el tamaño de la proporción, que es mayor.

:::figura[El tiempo de espera del ejemplo: con desviación estándar de 12 minutos y margen de 2 minutos se necesitan 139 pacientes en una población grande y 130 entre los 2000 pacientes del mes.]{componente="PrecisionPlanner"}
```yaml
modo: tamano
tipo: media
S: 12
margen: 2
margenMaximo: 8
confianza: 0.95
N: 2000
variable: Tiempo de espera
unidad: min
```
:::

## Propiedades

- **El tamaño crece como $1/E^2$**: reducir el margen a la mitad cuadruplica $n_0$.
- **Crece con $z^2$**: pasar de 95 % a 99 % de confianza multiplica $n_0$ por $(2.576/1.96)^2 \approx 1.73$.
- **El valor $p = 0.5$ es conservador**: maximiza $p(1-p)$ y garantiza el margen para cualquier proporción.
- **El ajuste por población finita importa solo si $n_0$ es una fracción apreciable de $N$**: para $N$ muy grande, $n \approx n_0$.
- **El efecto de diseño multiplica directamente el tamaño**.

:::figura[Propiedad del efecto de diseño: una encuesta escolar por conglomerados con efecto de diseño 2 necesita el doble de alumnos para el mismo margen. Mueve el control del efecto de diseño.]{componente="PrecisionPlanner"}
```yaml
modo: tamano
tipo: proporcion
p: 0.3
margen: 0.03
margenMaximo: 0.12
confianza: 0.95
deff: 2
variable: Alumnos que desayunan antes de clases
```
:::

:::figura[Propiedad de la población finita: en una cooperativa de 300 socios, un margen de 5 puntos exige 169 socios en lugar de los 385 de una población grande.]{componente="PrecisionPlanner"}
```yaml
modo: tamano
tipo: proporcion
p: 0.5
margen: 0.05
margenMaximo: 0.2
confianza: 0.95
N: 300
variable: Socios a favor de ampliar el almacén
```
:::

## Errores comunes

- **Calcular el tamaño en proporción a la población**, por ejemplo "el 10 % de la población". Para poblaciones grandes, el tamaño necesario casi no depende de $N$.
- **Olvidar la no respuesta.** El tamaño calculado es el de las respuestas; si solo contesta la mitad, hay que sortear el doble.
- **Usar la fórmula del muestreo aleatorio simple en un diseño con conglomerados** sin multiplicar por el efecto de diseño.
- **Planear con una $S$ optimista.** Si la desviación estándar real es el doble de la anticipada, el margen obtenido será el doble del deseado.

:::figura[Error de pensar en porcentajes de la población: para un margen de 3 puntos en un estado de dos millones de votantes se necesitan 1067 entrevistas, prácticamente las mismas que en un país entero.]{componente="PrecisionPlanner"}
```yaml
modo: tamano
tipo: proporcion
p: 0.5
margen: 0.03
margenMaximo: 0.12
confianza: 0.95
N: 2000000
variable: Intención de voto
```
:::

## Conexiones

El cálculo del tamaño de muestra despeja $n$ de la fórmula del [[error-muestral-y-margen-de-error|margen de error]] y usa el [[factor-de-correccion-por-poblacion-finita]] en forma de $n_0/(1 + n_0/N)$. En diseños complejos se multiplica por el [[efecto-de-diseno]], y en la [[asignacion-proporcional-y-asignacion-de-neyman|asignación entre estratos]] se reparte el resultado. Cuando el objetivo no es estimar sino detectar una diferencia, el tamaño se determina con un análisis de potencia.

## Formulario

:::formula[Tamaño para una proporción]
$$
n_0 = \frac{z_{1-\alpha/2}^2\,p(1-p)}{E^2}
$$

- $p$: proporción anticipada; $E$: margen deseado.
- $z_{1-\alpha/2}$: cuantil de la normal estándar.
:::

:::formula[Tamaño para una media]
$$
n_0 = \left(\frac{z_{1-\alpha/2}\,S}{E}\right)^2
$$

- $S$: desviación estándar anticipada de la variable.
:::

:::formula[Ajuste por población finita]
$$
n = \frac{n_0}{1 + n_0/N}
$$

- $N$: tamaño de la población; se redondea hacia arriba.
:::

:::formula[Ajustes por diseño y por no respuesta]
$$
n_{\text{diseño}} = n_0 \cdot \text{deff}, \qquad n_{\text{sorteo}} = \frac{n}{R}
$$

- $\text{deff}$: efecto de diseño.
- $R$: tasa de respuesta esperada.
:::
