---
id: contenido-de-informacion
titulo: Contenido de información (sorpresa)
titulo_en: Information content (surprisal)
alias:
  - sorpresa
  - autoinformación
  - información propia
  - surprisal
modulo: 0
submodulo: '0.8'
orden: 1
nivel: intermedio
prerrequisitos:
  - axiomas-de-kolmogorov
  - funcion-exponencial-y-logaritmo-natural
etiquetas:
  - sorpresa
  - bits
  - logaritmos
  - teoría de la información
resumen: >
  La sorpresa de un evento de probabilidad p es -log2 p bits: cero para lo seguro, un bit para un
  volado y cada vez más para lo raro. Es aditiva para eventos independientes.
formula: 'I(A) = -\log_2 P(A) = \log_2 \frac{1}{P(A)}'
visualizacion:
  componente: InformationViz
  parametros:
    modo: sorpresa
    eventos:
      - nombre: cara
        p: 0.5
      - nombre: seis
        p: 0.1667
      - nombre: doble seis
        p: 0.0278
      - nombre: sale el sol
        p: 0.999
referencias:
  - clave: cover-thomas
    capitulo: '2'
publicado: true
---

## Intuición

Que amanezca no es noticia; que nieve en Mérida sí lo es. La cantidad de información que trae un suceso depende de cuánto se esperaba: lo seguro no informa nada y lo improbable informa mucho. Shannon tradujo esa idea a un número, la sorpresa, que solo depende de la probabilidad del suceso.

La escala elegida es el logaritmo de $1/p$. Con base 2 la unidad es el bit, que es la sorpresa de un volado con moneda justa: saber si cayó cara resuelve exactamente una pregunta de sí o no. Un evento con probabilidad $1/4$ equivale a dos volados seguidos y vale 2 bits; uno con probabilidad $1/8$ vale 3 bits. Cada vez que la probabilidad se divide entre dos, la sorpresa sube un bit.

El logaritmo tiene además la propiedad que se espera de una medida de información: si dos sucesos son independientes, la sorpresa de que ocurran ambos es la suma de sus sorpresas, porque sus probabilidades se multiplican.

## Definición

:::definicion[Contenido de información]
Sea $A$ un evento con $P(A) > 0$. Su contenido de información, o sorpresa, es
$$
I(A) = -\log_b P(A) = \log_b \frac{1}{P(A)}.
$$
Con $b = 2$ se mide en bits; con $b = e$, en nats. Para un valor $x$ de una variable discreta $X$ con función de masa $p$, se escribe $I(x) = -\log_2 p(x)$.
:::

Es la única función de la probabilidad, salvo la elección de la base, que es decreciente, continua, vale cero en $p = 1$ y convierte productos de probabilidades de eventos independientes en sumas.

:::nota[Qué significa cada símbolo]
- $A$: evento.
- $P(A)$: probabilidad del evento.
- $I(A)$: sorpresa del evento.
- $b$: base del logaritmo, que fija la unidad.
- $X$: variable aleatoria discreta; $x$: uno de sus valores.
- $p(x)$: probabilidad de que $X$ valga $x$.
:::

## Cómo usar la visualización

La curva es $I(p) = -\log_2 p$ para $p$ entre 0 y 1. Los puntos son los eventos de la lista, y la animación los recorre uno por uno: marca el evento actual, baja una línea punteada hasta el eje y escribe en el encabezado el cálculo de su sorpresa. Las lecturas dan la probabilidad y la sorpresa en bits y en nats.

Conviene observar que el volado vale exactamente 1 bit, que el seis de un dado vale 2.585 bits y el doble seis 5.17 bits, el doble de lo anterior, y que la salida del sol, con probabilidad 0.999, queda pegada al eje con 0.0014 bits. La curva sube sin límite al acercarse a $p = 0$.

## Ejemplo

Un pronóstico asigna probabilidad 0.25 de lluvia para mañana en Guadalajara.

1. Si llueve, la sorpresa es $-\log_2 0.25 = \log_2 4 = 2$ bits.
2. Si no llueve, la probabilidad es $0.75$ y la sorpresa es $-\log_2 0.75 = 0.415$ bits.
3. En nats, las mismas sorpresas son $\log 4 = 1.386$ y $-\log 0.75 = 0.288$; la conversión es $1\ \text{bit} = \log 2 = 0.693$ nats.

El suceso menos probable informa casi cinco veces más que el probable.

:::figura[El pronóstico con 0.25 de lluvia: la lluvia queda en 2 bits sobre la curva y el día seco en 0.415 bits, cerca del eje.]{componente="InformationViz"}
```yaml
modo: sorpresa
eventos:
  - nombre: lluvia
    p: 0.25
  - nombre: sin lluvia
    p: 0.75
```
:::

## Propiedades

- **No negatividad:** $I(A) \ge 0$, con igualdad solo si $P(A) = 1$.
- **Monotonía:** si $P(A) < P(B)$ entonces $I(A) > I(B)$.
- **Aditividad para eventos independientes:** si $A$ y $B$ son independientes, $I(A \cap B) = I(A) + I(B)$, porque $\log_2 \frac{1}{P(A)P(B)} = \log_2 \frac{1}{P(A)} + \log_2 \frac{1}{P(B)}$.

:::figura[Volado y dado independientes: cara vale 1 bit, el seis 2.585 bits y la pareja cara y seis, con probabilidad 1/12, vale 3.585 bits, la suma de las dos sorpresas.]{componente="InformationViz"}
```yaml
modo: sorpresa
eventos:
  - nombre: cara
    p: 0.5
  - nombre: seis
    p: 0.1667
  - nombre: cara y seis
    p: 0.0833
```
:::

- **Cambio de base:** $I_b(A) = I_2(A) / \log_2 b$; en particular, la sorpresa en nats es la sorpresa en bits por $0.693$.
- **Eventos imposibles:** cuando $P(A) \to 0$, $I(A) \to \infty$; un evento de probabilidad cero no tiene sorpresa finita.

## Errores comunes

- **Pensar que la sorpresa es proporcional a la rareza.** Pasar de $p = 1/2$ a $p = 1/4$ y luego a $p = 1/8$ no duplica cada vez la sorpresa: le suma un bit. La escala es logarítmica.

:::figura[Probabilidades 1/2, 1/4, 1/8 y 1/16: las sorpresas son 1, 2, 3 y 4 bits; cada vez que la probabilidad se divide entre dos, el punto sube un solo bit.]{componente="InformationViz"}
```yaml
modo: sorpresa
eventos:
  - nombre: 1/2
    p: 0.5
  - nombre: 1/4
    p: 0.25
  - nombre: 1/8
    p: 0.125
  - nombre: 1/16
    p: 0.0625
```
:::

- **Confundir información con utilidad o con significado.** La sorpresa mide cuán inesperado es un resultado, no si es importante. Un número de lotería que no gana trae muy poca información aunque a quien lo compró le importe.
- **Mezclar unidades.** Un resultado en nats no se compara con uno en bits sin convertir. En aprendizaje automático suele usarse el logaritmo natural y en codificación, el de base 2.
- **Sumar sorpresas de eventos dependientes.** La aditividad exige independencia; en general $I(A \cap B) = I(A) + I(B \mid A)$, con la sorpresa condicional $-\log_2 P(B \mid A)$.

## Conexiones

La sorpresa se construye sobre la medida de probabilidad de los [[axiomas-de-kolmogorov]] y sobre la [[funcion-exponencial-y-logaritmo-natural]]. Su promedio sobre todos los resultados es la [[entropia-de-shannon]], y su promedio bajo una distribución distinta de la que asigna las probabilidades es la [[entropia-cruzada]]. La aditividad depende de la [[independencia-de-eventos]].

## Formulario

:::formula[Sorpresa]
$$
I(A) = -\log_b P(A)
$$

- $A$: evento; $P(A)$: su probabilidad, mayor que cero; $b$: base del logaritmo (2 para bits, $e$ para nats).
:::

:::formula[Aditividad para eventos independientes]
$$
I(A \cap B) = I(A) + I(B)
$$

- $A$, $B$: eventos independientes; $I$: sorpresa en la misma base.
:::

:::formula[Cambio de unidad]
$$
I_{\text{nats}} = I_{\text{bits}} \cdot \log 2, \qquad \log 2 = 0.693
$$

- $I_{\text{bits}}$: sorpresa en base 2; $I_{\text{nats}}$: sorpresa en base $e$; $\log$: logaritmo natural.
:::
