---
id: aguja-de-buffon
titulo: Aguja de Buffon
titulo_en: Buffon's needle
alias:
  - problema de la aguja de Buffon
  - agujas de Buffon
modulo: 1
submodulo: '1.1'
orden: 12
nivel: basico
prerrequisitos:
  - probabilidad-geometrica
relaciones:
  - tipo: relacionado
    id: estimacion-de-pi-por-monte-carlo
etiquetas:
  - probabilidad geométrica
  - estimación de pi
  - Buffon
  - simulación
resumen: >
  Una aguja de longitud l lanzada al azar sobre un piso con líneas paralelas separadas t, con l menor
  o igual que t, cruza una línea con probabilidad 2l/(πt). Contar cruces permite estimar π.
formula: 'P(\text{cruza}) = \frac{2l}{\pi t}, \qquad l \le t'
visualizacion:
  componente: BuffonNeedle
  parametros:
    largo: 0.8
referencias:
  - clave: ross-probabilidad
    capitulo: '6'
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

En 1777, el naturalista Georges-Louis Leclerc, conde de Buffon, planteó un juego: se deja caer una aguja sobre un piso de duela, cuyas tablas forman líneas paralelas equidistantes. ¿Qué tan probable es que la aguja quede atravesando una línea? La respuesta sorprende porque contiene a $\pi$, aunque en el problema no aparece ningún círculo.

El círculo está escondido en el ángulo. La posición de la aguja se describe con dos números: la distancia de su centro a la línea más cercana y el ángulo que forma con las líneas. Una aguja horizontal casi nunca cruza; una vertical cruza si su centro está a menos de media aguja de la línea. En general, cruza cuando la distancia es menor que la mitad de la aguja multiplicada por el seno del ángulo. Promediar ese seno sobre todos los ángulos, de 0 a $\pi$, es lo que introduce a $\pi$ en la respuesta.

Leída al revés, la fórmula es un método para estimar $\pi$ lanzando agujas: basta contar cuántas cruzan. Es uno de los primeros ejemplos de estimación por simulación, aunque converge con mucha lentitud.

## Definición

Sea un plano con rectas paralelas separadas una distancia $t$ y una aguja de longitud $l \le t$ lanzada al azar. Se describe la posición con:

- $X$: distancia del centro de la aguja a la recta más cercana, uniforme en $[0, t/2]$.
- $\Theta$: ángulo entre la aguja y las rectas, uniforme en $[0, \pi]$, independiente de $X$.

La aguja cruza una recta si y solo si $X \le \frac{l}{2}\sin\Theta$.

:::teorema[Aguja de Buffon]
Si $l \le t$,

$$
P(\text{cruza}) = \frac{2l}{\pi t}.
$$

:::

:::demostracion
El par $(\Theta, X)$ es uniforme en el rectángulo $[0, \pi] \times [0, t/2]$, de área $\pi t / 2$. La región favorable es la que está bajo la curva $x = \frac{l}{2}\sin\theta$, con área

$$
\int_0^{\pi} \frac{l}{2}\sin\theta\, d\theta = \frac{l}{2}\big[-\cos\theta\big]_0^{\pi} = l.
$$

Por probabilidad geométrica, $P(\text{cruza}) = l \big/ (\pi t / 2) = 2l/(\pi t)$. La condición $l \le t$ garantiza que la aguja no alcance dos rectas y que $\frac{l}{2}\sin\theta$ no exceda $t/2$.
:::

:::figura[Cada aguja es un punto del rectángulo ángulo por distancia. Las que cruzan son exactamente los puntos bajo la curva x = (l/2) sen θ, cuya área, dividida entre la del rectángulo, es 2l/(πt).]{componente="BuffonNeedle"}

```yaml
largo: 0.8
vista: espacio
```

:::

:::nota[Qué significa cada símbolo]

- $l$: longitud de la aguja; $t$: separación entre las rectas; se requiere $l \le t$.
- $X$: distancia del centro de la aguja a la recta más cercana, entre 0 y $t/2$.
- $\Theta$: ángulo entre la aguja y las rectas, entre 0 y $\pi$ radianes.
- $\sin\Theta$: seno del ángulo; $\frac{l}{2}\sin\Theta$ es la distancia vertical del centro a un extremo de la aguja.
- $n$: número de agujas lanzadas; $h$: número de agujas que cruzan una recta.
- $\hat{\pi}$: estimación de $\pi$ a partir de $n$ y $h$.
- $p = 2l/(\pi t)$: probabilidad de cruce.
  :::

## Cómo usar la visualización

La vista "Agujas sobre el piso" muestra rectas separadas una unidad y agujas que caen con centro y ángulo al azar; las que tocan una recta se dibujan en color. La vista "Distancia y ángulo" representa cada aguja como un punto: su ángulo en el eje horizontal y la distancia de su centro a la recta más cercana en el vertical; la región sombreada son los cruces. Abajo, la estimación $\hat{\pi} = 2ln/(th)$ se compara con $\pi$.

Con largo 0.8, cerca de la mitad de las agujas cruzan ($p = 1.6/\pi \approx 0.51$). Al reducir el largo a 0.2 la curva de la segunda vista se aplana, los cruces se vuelven escasos y la estimación de $\pi$ fluctúa mucho más. Incluso con miles de agujas la estimación suele equivocarse en la segunda cifra decimal.

## Ejemplo

Se lanzan $n = 500$ palillos de 4 cm sobre un piso con líneas separadas 5 cm, y 256 cruzan una línea.

1. Probabilidad teórica de cruce: $p = 2 \cdot 4 / (\pi \cdot 5) = 8/(5\pi) \approx 0.509$.
2. Proporción observada: $256/500 = 0.512$.
3. Despejando $\pi$ de $h/n \approx 2l/(\pi t)$: $\hat{\pi} = \dfrac{2 l n}{t h} = \dfrac{2 \cdot 4 \cdot 500}{5 \cdot 256} = \dfrac{4000}{1280} = 3.125$.
4. El error es $\pi - 3.125 \approx 0.017$. Es un resultado afortunado: con 500 lanzamientos el error estándar es $\pi\sqrt{0.491/(500 \cdot 0.509)} \approx 0.14$.

:::figura[Agujas con largo igual a la mitad de la separación: la probabilidad de cruce es exactamente 1/π, cerca de 0.318, y la estimación de π se construye como n entre h.]{componente="BuffonNeedle"}

```yaml
largo: 0.5
```

:::

## Propiedades

- **Caso $l = t$:** la probabilidad de cruce es $2/\pi \approx 0.637$, la máxima posible en este régimen.
- **Estimador de $\pi$:** $\hat{\pi} = 2ln/(th)$. Su error estándar aproximado es $\pi\sqrt{(1 - p)/(np)}$; con $l = t$ vale cerca de $2.37/\sqrt{n}$.
- **Convergencia lenta:** para obtener tres decimales correctos con alta confianza se requieren del orden de $10^8$ lanzamientos.
- **Aguja larga:** si $l > t$, la aguja puede cruzar varias rectas; el número esperado de cruces sigue siendo $2l/(\pi t)$ para cualquier $l$, aunque la probabilidad de cruzar al menos una tiene otra fórmula.

:::figura[Aguja tan larga como la separación: cerca del 64 % de las agujas cruza, el valor máximo 2/π. Con más cruces por aguja la estimación de π fluctúa menos.]{componente="BuffonNeedle"}

```yaml
largo: 1
vista: espacio
```

:::

:::figura[Agujas muy cortas, de largo 0.2: solo cerca del 13 % cruza y la estimación de π fluctúa mucho más para el mismo número de lanzamientos.]{componente="BuffonNeedle"}

```yaml
largo: 0.2
agujas: 3000
```

:::

## Errores comunes

- **Esperar precisión rápida.** El error baja como $1/\sqrt{n}$: con 10000 agujas la estimación típica todavía se equivoca en la segunda cifra decimal.
- **Creer los resultados demasiado buenos.** En 1901, Mario Lazzarini reportó $\hat{\pi} = 355/113$, correcto a seis decimales, con 3408 lanzamientos. La precisión es incompatible con la variabilidad del método y sugiere que detuvo el experimento en el momento conveniente.
- **Usar la fórmula con agujas más largas que la separación.** Para $l > t$ la probabilidad de cruce ya no es $2l/(\pi t)$, que incluso podría superar 1.
- **Olvidar que el ángulo debe ser uniforme.** Si las agujas tienden a caer paralelas a las líneas (por ejemplo, por la veta de la madera), la fórmula deja de valer.

:::figura[Con largo 0.8 y 5000 agujas, la estimación de π sigue oscilando alrededor del valor verdadero; la segunda cifra decimal todavía no es confiable.]{componente="BuffonNeedle"}

```yaml
largo: 0.8
agujas: 5000
```

:::

## Conexiones

La aguja de Buffon es un caso emblemático de [[probabilidad-geometrica]], con región favorable definida por una curva. Su lectura inversa es un método de [[estimacion-de-probabilidades-por-simulacion-monte-carlo]], emparentado con la [[estimacion-de-pi-por-monte-carlo]] mediante puntos en un cuadrado. El cálculo del área favorable usa una integral del seno, y la generalización al número esperado de cruces de curvas arbitrarias se conoce como el problema del fideo de Buffon.

## Formulario

:::formula[Probabilidad de cruce]

$$
P(\text{cruza}) = \frac{2l}{\pi t}, \qquad l \le t
$$

- $l$: longitud de la aguja; $t$: separación entre rectas.
  :::

:::formula[Condición de cruce]

$$
X \le \frac{l}{2}\sin\Theta
$$

- $X$: distancia del centro a la recta más cercana, uniforme en $[0, t/2]$.
- $\Theta$: ángulo con las rectas, uniforme en $[0, \pi]$.
  :::

:::formula[Estimador de pi]

$$
\hat{\pi} = \frac{2 l\, n}{t\, h}
$$

- $n$: agujas lanzadas; $h$: agujas que cruzan.
  :::

:::formula[Error estándar aproximado]

$$
\mathrm{EE}(\hat{\pi}) \approx \pi\sqrt{\frac{1 - p}{n\,p}}, \qquad p = \frac{2l}{\pi t}
$$

- $p$: probabilidad de cruce; $\mathrm{EE}$: tamaño típico del error de $\hat{\pi}$.
  :::
