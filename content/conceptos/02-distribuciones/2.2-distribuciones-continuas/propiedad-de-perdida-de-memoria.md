---
id: propiedad-de-perdida-de-memoria
titulo: Propiedad de pérdida de memoria
titulo_en: Memoryless property
alias:
  - falta de memoria
  - memorylessness
  - ausencia de memoria
modulo: 2
submodulo: '2.2'
orden: 6
nivel: basico
prerrequisitos:
  - distribucion-exponencial
relaciones:
  - tipo: relacionado
    id: distribucion-geometrica
etiquetas:
  - exponencial
  - geométrica
  - espera residual
  - tasa de falla
resumen: >
  Una espera no tiene memoria si, sabiendo que ya duró s, lo que falta tiene la misma distribución que la
  espera completa. Solo la exponencial (continua) y la geométrica (discreta) la cumplen.
formula: 'P(X > s + t \mid X > s) = P(X > t)'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: exponencial
      valores:
        lambda: 0.5
      region: derecha
      desde: 2
      casos:
        - nombre: 'Más de 1 minuto'
          descripcion: 'P(X > 1) = 0.607: probabilidad de que la espera supere un minuto.'
          valores: {lambda: 0.5}
          region: derecha
          desde: 1
        - nombre: 'Más de 3 minutos'
          descripcion: 'P(X > 3) = 0.223. Dividida entre P(X > 1) da 0.368, la probabilidad de esperar 2 minutos más tras haber esperado 1.'
          valores: {lambda: 0.5}
          region: derecha
          desde: 3
        - nombre: 'Más de 2 minutos'
          descripcion: 'P(X > 2) = 0.368, igual al cociente anterior: esperar 2 minutos más no depende de lo ya esperado.'
          valores: {lambda: 0.5}
          region: derecha
          desde: 2
      ejemplo:
        titulo: 'Taxi libre'
        contexto: 'Los taxis libres pasan al azar con tasa 0.5 por minuto y una persona ya esperó 1 minuto.'
        pregunta: '¿Qué probabilidad hay de esperar al menos 2 minutos más? Debe coincidir con la probabilidad de esperar más de 2 desde el inicio.'
        valores: {lambda: 0.5}
        region: derecha
        desde: 2
      referencia:
        distribucion: uniforme
        valores: {a: 0, b: 4}
        etiqueta: 'Horario fijo cada 4 minutos (con memoria)'
        visible: false
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: espera-residual
        valores:
          lambda: 0.5
          s: 2
referencias:
  - clave: blitzstein-hwang
    capitulo: '5'
  - clave: ross-procesos
    capitulo: '5'
publicado: true
---

## Intuición

Una persona espera un taxi libre en una avenida transitada, donde pasa en promedio un taxi libre cada dos minutos, a intervalos irregulares. Lleva ya cinco minutos esperando. ¿Debe esperar que el siguiente esté por llegar? Si los taxis pasan sin ningún patrón, como un proceso de Poisson, la respuesta es no: lo que le falta por esperar tiene exactamente la misma distribución que tenía cuando llegó. Los cinco minutos esperados no cuentan.

Esto es la pérdida de memoria. Una espera la tiene cuando el pasado no informa sobre el futuro: en cada instante, la probabilidad de que el evento ocurra en el siguiente momento es la misma, sin importar cuánto se lleve esperando. Es la situación opuesta al desgaste, donde una máquina vieja tiene más probabilidad de fallar, y también a los horarios fijos, donde cada minuto de espera acerca la llegada del autobús.

Aunque parezca contraintuitivo, la falta de memoria es una propiedad muy restrictiva: entre las distribuciones continuas solo la tiene la exponencial, y entre las discretas solo la geométrica. Por eso la exponencial es el modelo natural de llegadas al azar y de fallas puramente accidentales.

## Definición

:::definicion[Pérdida de memoria]
Una variable aleatoria positiva $X$ **no tiene memoria** si para todos $s, t \ge 0$
$$
P(X > s + t \mid X > s) = P(X > t).
$$
Equivalentemente, $P(X > s + t) = P(X > s)\,P(X > t)$.
:::

:::teorema[Caracterización]
Una variable continua y positiva no tiene memoria si y solo si es exponencial. Una variable con valores en $\{1, 2, \dots\}$ no tiene memoria (con $s, t$ enteros) si y solo si es geométrica.
:::

:::nota[Qué significa cada símbolo]
- $X$: tiempo de espera, positivo.
- $s$: tiempo que ya se esperó.
- $t$: tiempo adicional.
- $P(X > s + t \mid X > s)$: probabilidad de esperar $t$ más, sabiendo que ya se esperó $s$.
- $P(X > t)$: probabilidad de esperar más de $t$ desde el inicio.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la exponencial con la cola $P(X > a)$ sombreada. Los tres casos cargan las colas de 1, 2 y 3 minutos: el cociente de la tercera entre la primera es igual a la segunda, que es la propiedad. La comparación superpone una espera uniforme de horario fijo, que sí tiene memoria. La pestaña Ver cómo surge descarta las esperas que terminaron antes de $s$ y registra lo que falta en las que siguen.

En la pestaña animada, al subir $s$ a 6 se descartan muchas más esperas, pero el histograma del exceso no cambia: sigue siendo la exponencial original.

## Ejemplo

Los taxis libres pasan como un proceso de Poisson con tasa 0.5 por minuto, así que la espera $X$ es $\operatorname{Exp}(0.5)$ con media 2 minutos.

1. Al llegar, la probabilidad de esperar más de 2 minutos es $e^{-0.5 \cdot 2} = e^{-1} \approx 0.368$.
2. Tras esperar 1 minuto sin taxi, la probabilidad de esperar al menos 2 minutos más: $P(X > 3 \mid X > 1) = e^{-1.5}/e^{-0.5} = e^{-1} \approx 0.368$, la misma.
3. La espera adicional media sigue siendo 2 minutos, y la espera total esperada, dado que ya pasó 1 minuto, es $1 + 2 = 3$.
4. Con un autobús de horario fijo cada 4 minutos y llegada al azar, la espera es $U(0, 4)$: tras 1 minuto, lo que falta es $U(0, 3)$, con media 1.5 en lugar de 2. Ese modelo sí tiene memoria.

:::figura[Los taxis: tras haber esperado 1 minuto se descartan las esperas que ya terminaron y lo que falta vuelve a ser Exp(0.5).]{componente="ContinuousGenesis"}
```yaml
proceso: espera-residual
valores:
  lambda: 0.5
  s: 1
```
:::

:::figura[La identidad en la exponencial: el área sombreada a la derecha de 2 vale 0.368, igual que la proporción de esperas mayores que 3 entre las mayores que 1.]{componente="DistributionExplorer"}
```yaml
distribucion: exponencial
valores:
  lambda: 0.5
region: derecha
desde: 2
ejemplo:
  titulo: 'Taxi libre'
  contexto: 'Los taxis libres pasan al azar con tasa 0.5 por minuto y una persona ya esperó 1 minuto.'
  pregunta: '¿Qué probabilidad hay de esperar al menos 2 minutos más? Debe coincidir con la probabilidad de esperar más de 2 desde el inicio.'
  valores: {lambda: 0.5}
  region: derecha
  desde: 2
muestras: false
referencia:
  distribucion: uniforme
  valores: {a: 0, b: 4}
  etiqueta: 'Horario fijo cada 4 minutos (con memoria)'
  visible: false
```
:::

## Propiedades

- **Forma multiplicativa:** $S(s + t) = S(s)S(t)$, con $S(x) = P(X > x)$; la única solución continua y decreciente es $S(x) = e^{-\lambda x}$.
- **Tasa de falla constante:** la probabilidad de que el evento ocurra en el siguiente instante, dado que no ha ocurrido, es $\lambda$ en todo momento.
- **Espera residual:** $X - s \mid X > s$ tiene la misma distribución que $X$.
- **Versión discreta:** en la geométrica, $P(X > m + n \mid X > m) = P(X > n)$ para enteros $m, n$.
- **Consecuencia en procesos:** en un proceso de Poisson, el tiempo hasta el siguiente evento desde cualquier instante fijo es exponencial, sin importar cuándo fue el último.

:::figura[Tres casos con contexto (más de 1 minuto, más de 3 minutos, más de 2 minutos): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: exponencial
valores:
  lambda: 0.5
region: derecha
desde: 2
casos:
  - nombre: 'Más de 1 minuto'
    descripcion: 'P(X > 1) = 0.607: probabilidad de que la espera supere un minuto.'
    valores: {lambda: 0.5}
    region: derecha
    desde: 1
  - nombre: 'Más de 3 minutos'
    descripcion: 'P(X > 3) = 0.223. Dividida entre P(X > 1) da 0.368, la probabilidad de esperar 2 minutos más tras haber esperado 1.'
    valores: {lambda: 0.5}
    region: derecha
    desde: 3
  - nombre: 'Más de 2 minutos'
    descripcion: 'P(X > 2) = 0.368, igual al cociente anterior: esperar 2 minutos más no depende de lo ya esperado.'
    valores: {lambda: 0.5}
    region: derecha
    desde: 2
referencia:
  distribucion: uniforme
  valores: {a: 0, b: 4}
  etiqueta: 'Horario fijo cada 4 minutos (con memoria)'
  visible: false
```
:::

:::figura[Con s = 5 se descartan casi todas las esperas, pero las que sobreviven dejan un exceso con la misma distribución Exp(0.5).]{componente="ContinuousGenesis"}
```yaml
proceso: espera-residual
valores:
  lambda: 0.5
  s: 5
```
:::

:::demostracion
Si $S(x) = P(X > x)$ cumple $S(s + t) = S(s)S(t)$ y es continua, entonces $g(x) = \log S(x)$ cumple $g(s + t) = g(s) + g(t)$, cuya única solución continua es lineal: $g(x) = -\lambda x$. Así $S(x) = e^{-\lambda x}$, con $\lambda > 0$ para que $S$ tienda a cero, y $X$ es exponencial.
:::

## Errores comunes

- **La falacia del "ya casi llega".** Tras una espera larga con llegadas al azar, lo que falta no se acorta.
- **Atribuir falta de memoria a cualquier espera.** Las esperas con horario fijo, las vidas con desgaste o los tiempos de servicio con etapas tienen memoria.
- **Confundir la espera residual con la total.** Lo que no cambia es la espera adicional; la espera total, dado que ya pasó $s$, es $s$ más una exponencial.
- **Concluir que todos los tiempos de espera son exponenciales.** La falta de memoria es una hipótesis del modelo que hay que justificar con los datos.

:::figura[Una espera con memoria: con horario fijo cada 4 minutos la espera es uniforme y su función de distribución (curva) llega a 1 en 4 minutos; la exponencial de la misma media (línea punteada) nunca garantiza la llegada.]{componente="DistributionExplorer"}
```yaml
distribucion: uniforme
valores:
  a: 0
  b: 4
dominio: [0, 8]
vista: acumulada
muestras: false
referencia:
  distribucion: exponencial
  valores:
    lambda: 0.5
  etiqueta: Exp(0.5), sin memoria
```
:::

## Conexiones

La propiedad caracteriza a la [[distribucion-exponencial]] entre las continuas y a la [[distribucion-geometrica]] entre las discretas. Es la razón por la que los procesos de Poisson se pueden "reiniciar" en cualquier momento y por la que la [[distribucion-de-erlang]] se obtiene sumando esperas independientes. La [[distribucion-de-weibull]] generaliza la exponencial permitiendo tasas de falla crecientes o decrecientes, es decir, con memoria.

## Formulario

:::formula[Pérdida de memoria]
$$
P(X > s + t \mid X > s) = P(X > t)
$$

- $s$: tiempo ya esperado.
- $t$: tiempo adicional.
:::

:::formula[Forma multiplicativa]
$$
S(s + t) = S(s)\,S(t), \qquad S(x) = P(X > x)
$$

- $S$: función de supervivencia.
:::

:::formula[Supervivencia exponencial]
$$
S(x) = e^{-\lambda x}
$$

- $\lambda$: tasa constante de ocurrencia.
:::

:::formula[Espera residual]
$$
X - s \mid X > s \;\sim\; \operatorname{Exp}(\lambda)
$$

- La espera adicional tiene la misma distribución que la original.
:::
