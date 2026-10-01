---
id: problema-de-la-secretaria
titulo: Problema de la secretaria
titulo_en: Secretary problem
alias:
  - problema del matrimonio
  - regla de 1/e
  - problema de parada óptima
modulo: 1
submodulo: '1.2'
orden: 20
nivel: intermedio
prerrequisitos:
  - probabilidad-condicional
  - permutaciones
etiquetas:
  - parada óptima
  - decisiones secuenciales
  - regla 1/e
  - permutaciones aleatorias
resumen: >
  Para elegir al mejor de n candidatos que llegan en orden aleatorio, decidiendo al momento, conviene
  rechazar a los primeros n/e y luego aceptar al primero que supere a todos los anteriores; se acierta cerca de 37 %.
formula: 'P(r) = \frac{r}{n}\sum_{i=r+1}^{n}\frac{1}{i-1} \;\longrightarrow\; \frac{1}{e} \approx 0.368'
visualizacion:
  componente: SecretaryProblem
  parametros:
    candidatos: 20
    descartar: 7
referencias:
  - clave: ross-probabilidad
    capitulo: '3'
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una empresa entrevista a 20 candidatos para un puesto, uno por uno, en orden aleatorio. Después de cada entrevista debe decidir en ese momento si contrata a la persona; si la rechaza, no puede volver a llamarla. Solo le interesa contratar a la mejor. ¿Qué estrategia maximiza la probabilidad de lograrlo?

Contratar a la primera persona acierta con probabilidad 1/20. Esperar hasta el final tampoco sirve, porque la última es la mejor también con probabilidad 1/20. La estrategia óptima combina exploración y decisión: rechazar a los primeros $r$ candidatos, solo para conocer el nivel, y después contratar al primero que sea mejor que todos los anteriores. Con 20 candidatos, lo mejor es rechazar a los primeros 7 y se acierta con probabilidad 0.384.

Lo sorprendente es que la probabilidad de éxito no cae a cero aunque el número de candidatos crezca: tiende a $1/e \approx 0.368$, y el número óptimo de rechazos tiende a $n/e$, cerca del 37 % de los candidatos.

## Definición

Hay $n$ candidatos con calidades distintas que llegan en orden aleatorio (todas las permutaciones son igualmente probables). Solo se observa la posición relativa de cada candidato respecto de los anteriores, y cada uno debe aceptarse o rechazarse de inmediato.

:::teorema[Regla del umbral]
La regla que rechaza a los primeros $r$ candidatos y acepta al primero que supere a todos los anteriores elige al mejor con probabilidad
$$
P(r) = \frac{r}{n}\sum_{i=r+1}^{n}\frac{1}{i - 1}, \qquad 1 \le r \le n - 1,
$$
y $P(0) = 1/n$. El valor óptimo de $r$ es aproximadamente $n/e$ y el máximo de $P(r)$ tiende a $1/e$ cuando $n \to \infty$.
:::

:::demostracion
Por la ley de probabilidad total sobre la posición $i$ del mejor candidato, que es uniforme en $\{1, \dots, n\}$: si $i \le r$, el mejor se rechazó. Si $i > r$, la regla lo elige exactamente cuando el mejor de los primeros $i - 1$ candidatos está entre los $r$ rechazados, lo que ocurre con probabilidad $r/(i - 1)$ porque, dada la posición del mejor, el orden de los demás es aleatorio. Sumando $\frac{1}{n}\cdot\frac{r}{i-1}$ para $i = r+1, \dots, n$ se obtiene la fórmula. Aproximando la suma por $\log(n/r)$, $P(r) \approx \frac{r}{n}\log\frac{n}{r}$, que se maximiza en $r = n/e$ con valor $1/e$.
:::

:::figura[Con 100 candidatos el r óptimo es 37 y la probabilidad de éxito es 0.371, muy cerca del límite 1/e.]{componente="SecretaryProblem"}
```yaml
candidatos: 100
descartar: 37
rondas: 1500
```
:::

:::nota[Qué significa cada símbolo]
- $n$: número de candidatos.
- $r$: número de candidatos que se rechazan al inicio sin importar su calidad.
- $i$: posición en la que llega el mejor candidato.
- $P(r)$: probabilidad de elegir al mejor con la regla de umbral $r$.
- $\frac{r}{i-1}$: probabilidad de que el mejor de los primeros $i - 1$ esté entre los $r$ rechazados.
- $e \approx 2.718$: base del logaritmo natural; $\log$: logaritmo natural.
:::

## Cómo usar la visualización

Cada barra es un candidato en orden de llegada, con altura proporcional a su calidad; el mejor tiene contorno. La línea vertical separa a los rechazados de entrada, y la horizontal punteada marca al mejor de ellos, que hay que superar. Las primeras rondas se muestran candidato por candidato; después se juegan completas. Abajo, la curva da la probabilidad exacta de éxito para cada $r$, con el punto simulado para el $r$ elegido.

Con 20 candidatos y $r = 7$ la probabilidad exacta es 0.384. Al bajar $r$ a 3, cae a 0.307: se decide demasiado pronto. Al subirlo a 15, cae a 0.222: el mejor suele estar entre los rechazados. La curva es plana cerca del óptimo, así que elegir $r$ cerca de $n/e$ es suficiente.

## Ejemplo

Con $n = 5$ candidatos, se compara $r = 1$ con $r = 2$.

1. $r = 1$: $P(1) = \frac{1}{5}\left(1 + \frac{1}{2} + \frac{1}{3} + \frac{1}{4}\right) = \frac{1}{5}\cdot\frac{25}{12} = \frac{5}{12} \approx 0.417$.
2. $r = 2$: $P(2) = \frac{2}{5}\left(\frac{1}{2} + \frac{1}{3} + \frac{1}{4}\right) = \frac{2}{5}\cdot\frac{13}{12} = \frac{13}{30} \approx 0.433$.
3. $r = 3$: $P(3) = \frac{3}{5}\left(\frac{1}{3} + \frac{1}{4}\right) = \frac{3}{5}\cdot\frac{7}{12} = \frac{7}{20} = 0.35$.
4. El óptimo es $r = 2$, cerca de $5/e \approx 1.84$, con probabilidad 0.433.

:::figura[Los 5 candidatos del ejemplo con r = 2: la probabilidad exacta es 13/30 y la curva muestra que r = 1 y r = 3 son peores.]{componente="SecretaryProblem"}
```yaml
candidatos: 5
descartar: 2
rondas: 2000
```
:::

## Propiedades

- **Límite 1/e:** $\max_r P(r) \to 1/e \approx 0.368$ cuando $n \to \infty$; la regla óptima rechaza cerca del 36.8 % de los candidatos.
- **Optimalidad:** entre todas las reglas que solo usan las posiciones relativas, la regla de umbral con $r \approx n/e$ es óptima.
- **Curva plana:** $P(r)$ cambia poco cerca del óptimo; con 100 candidatos, cualquier $r$ entre 30 y 45 da más de 0.36.
- **Variantes:** si se acepta al segundo mejor, si hay costo por entrevista o si se conocen las calidades absolutas, la regla óptima cambia.

:::figura[Decidir demasiado pronto: con 20 candidatos y solo 3 rechazos iniciales, la probabilidad de éxito baja a 0.307.]{componente="SecretaryProblem"}
```yaml
candidatos: 20
descartar: 3
rondas: 1500
```
:::

## Errores comunes

- **Pensar que con muchos candidatos el éxito es casi imposible.** La probabilidad óptima no cae por debajo de $1/e$, sin importar $n$.
- **Rechazar a la mitad de los candidatos.** La intuición de "mitad para explorar y mitad para elegir" da menos que el umbral $n/e$; con 20 candidatos, $r = 10$ da 0.359 frente a 0.384.
- **Usar la regla cuando el orden no es aleatorio.** Si los mejores candidatos tienden a llegar al principio o al final, la probabilidad cambia por completo.

:::figura[Esperar demasiado: con 20 candidatos y 15 rechazos, el mejor queda entre los rechazados la mayoría de las veces y la probabilidad cae a 0.222.]{componente="SecretaryProblem"}
```yaml
candidatos: 20
descartar: 15
rondas: 1500
```
:::

## Conexiones

El problema se analiza con [[probabilidad-condicional]] sobre [[permutaciones]] aleatorias y la ley de probabilidad total sobre la posición del mejor. Es el ejemplo fundacional de la teoría de parada óptima, que se extiende a decisiones de inversión, subastas y algoritmos en línea. Comparte con el [[problema-del-coleccionista-de-cupones]] la aparición de los números armónicos, y su límite $1/e$ es el mismo que aparece en los desarreglos.

## Formulario

:::formula[Probabilidad de éxito con umbral r]
$$
P(r) = \frac{r}{n}\sum_{i=r+1}^{n}\frac{1}{i-1}
$$

- $n$: candidatos; $r$: rechazos iniciales; $i$: posición del mejor.
:::

:::formula[Aproximación continua]
$$
P(r) \approx \frac{r}{n}\log\frac{n}{r}
$$

- Se maximiza en $r = n/e$.
:::

:::formula[Valor óptimo asintótico]
$$
r^{*} \approx \frac{n}{e}, \qquad P(r^{*}) \to \frac{1}{e} \approx 0.368
$$

- $r^{*}$: número óptimo de rechazos iniciales.
:::

:::formula[Sin rechazos]
$$
P(0) = \frac{1}{n}
$$

- Aceptar al primer candidato equivale a elegir uno al azar.
:::
