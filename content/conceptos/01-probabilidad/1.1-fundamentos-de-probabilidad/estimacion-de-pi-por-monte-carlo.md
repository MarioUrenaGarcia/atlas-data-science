---
id: estimacion-de-pi-por-monte-carlo
titulo: Estimación de pi por Monte Carlo
titulo_en: Monte Carlo estimation of pi
alias:
  - método del dardo para pi
  - pi por puntos aleatorios
modulo: 1
submodulo: '1.1'
orden: 14
nivel: basico
prerrequisitos:
  - estimacion-de-probabilidades-por-simulacion-monte-carlo
  - probabilidad-geometrica
relaciones:
  - tipo: contrasta
    id: aguja-de-buffon
etiquetas:
  - Monte Carlo
  - pi
  - probabilidad geométrica
  - simulación
resumen: >
  Un punto uniforme en el cuadrado unitario cae dentro del cuarto de círculo de radio 1 con
  probabilidad π/4. Cuatro veces la proporción de puntos que caen dentro estima π.
formula: '\hat{\pi}_N = 4 \cdot \frac{1}{N}\sum_{i=1}^{N} \mathbf{1}\{X_i^2 + Y_i^2 \le 1\}'
visualizacion:
  componente: GeometricProbability
  parametros:
    escenario: cuarto-de-circulo
    puntos: 5000
referencias:
  - clave: murphy
  - clave: ross-procesos
    capitulo: '11'
publicado: true
---

## Intuición

Se dibuja un cuadrado de lado 1 y, dentro de él, un cuarto de círculo de radio 1 con centro en una esquina. Si se lanzan dardos al azar sobre el cuadrado, sin apuntar, la fracción que cae dentro del cuarto de círculo es aproximadamente la razón entre las dos áreas: $\pi/4$ entre 1. Multiplicar esa fracción por 4 da una estimación de $\pi$.

Este es el ejemplo más citado del método de Monte Carlo porque muestra todos sus rasgos en un problema cuya respuesta se conoce. La probabilidad se expresa como un área, el área se estima con la proporción de puntos aleatorios que caen en ella, y la estimación mejora al aumentar los puntos, aunque despacio.

Nadie calcula $\pi$ de esta manera en la práctica: las series numéricas dan millones de cifras en segundos, mientras que Monte Carlo necesita cien veces más puntos por cada cifra decimal adicional. Su valor está en que la misma técnica sirve para calcular áreas, volúmenes e integrales en dimensiones altas, donde los métodos deterministas dejan de funcionar.

## Definición

Sean $(X_i, Y_i)$, $i = 1, \dots, N$, puntos independientes y uniformes en el cuadrado $[0, 1]^2$. El evento "el punto cae en el cuarto de círculo" es $X_i^2 + Y_i^2 \le 1$ y, por probabilidad geométrica,

$$
p = P(X_i^2 + Y_i^2 \le 1) = \frac{\pi/4}{1} = \frac{\pi}{4}.
$$

:::definicion[Estimador de pi]

$$
\hat{\pi}_N = 4\,\hat{p}_N = \frac{4}{N}\sum_{i=1}^{N} \mathbf{1}\{X_i^2 + Y_i^2 \le 1\}.
$$

Es insesgado, $\mathbb{E}[\hat{\pi}_N] = \pi$, y su error estándar es

$$
\mathrm{EE}(\hat{\pi}_N) = 4\sqrt{\frac{p(1-p)}{N}} \approx \frac{1.64}{\sqrt{N}}.
$$

:::

:::figura[Veinte mil puntos en el cuadrado unitario: los que caen dentro del cuarto de círculo se colorean, y cuatro veces su proporción se estabiliza cerca de 3.14.]{componente="GeometricProbability"}

```yaml
escenario: cuarto-de-circulo
puntos: 20000
```

:::

:::nota[Qué significa cada símbolo]

- $(X_i, Y_i)$: coordenadas del punto $i$, uniformes en $[0, 1]$ e independientes.
- $N$: número de puntos simulados.
- $X_i^2 + Y_i^2 \le 1$: el punto está a distancia a lo más 1 del origen, es decir, dentro del cuarto de círculo.
- $\mathbf{1}\{\cdot\}$: indicadora, 1 si se cumple la condición y 0 si no.
- $p = \pi/4$: probabilidad de caer dentro; $\hat{p}_N$: proporción observada.
- $\hat{\pi}_N$: estimación de $\pi$; $\mathrm{EE}$: su error estándar.
- $1.64$: valor aproximado de $4\sqrt{(\pi/4)(1 - \pi/4)}$.
  :::

## Cómo usar la visualización

A la izquierda, cada punto nuevo cae al azar en el cuadrado unitario; los que quedan dentro del cuarto de círculo se colorean y el último se marca con un círculo. A la derecha, la curva sigue la estimación $4 \cdot (\text{dentro}/\text{total})$ junto a la línea de $\pi$ y la banda de 95 %. La fórmula de arriba muestra el cálculo con los conteos del momento.

Con 100 puntos la estimación suele estar entre 2.8 y 3.5. Con 5000, la banda de 95 % mide aproximadamente $\pm 0.045$ y la curva ya no se aleja de 3.1 a 3.2. Al generar una semilla nueva se obtiene otra trayectoria: la segunda cifra decimal cambia entre corridas.

## Ejemplo

Una corrida con $N = 2000$ puntos deja 1583 dentro del cuarto de círculo.

1. Proporción: $\hat{p} = 1583/2000 = 0.7915$.
2. Estimación: $\hat{\pi} = 4 \cdot 0.7915 = 3.166$.
3. Error estándar: $4\sqrt{0.7915 \cdot 0.2085/2000} \approx 0.0363$.
4. Intervalo de 95 %: $3.166 \pm 1.96 \cdot 0.0363$, es decir, de 3.095 a 3.237, que contiene a $\pi$.
5. Para un margen de $\pm 0.001$ harían falta cerca de $N = (1.96 \cdot 1.64/0.001)^2 \approx 10$ millones de puntos.

:::figura[Una corrida con 2000 puntos, como en el ejemplo: la estimación final se desvía de π en algunas centésimas, dentro de lo esperado.]{componente="GeometricProbability"}

```yaml
escenario: cuarto-de-circulo
puntos: 2000
semilla: 2024
```

:::

## Propiedades

- **Tasa $1/\sqrt{N}$:** el error estándar es $1.64/\sqrt{N}$; cada cifra decimal adicional exige 100 veces más puntos.
- **Comparación con Buffon:** con agujas de largo igual a la separación, el error estándar de la aguja de Buffon es cerca de $2.37/\sqrt{N}$, mayor que el del cuarto de círculo; se necesitan cerca del doble de lanzamientos para la misma precisión.
- **Generalización a integrales:** la misma idea estima $\int f$ como el área bajo la curva de $f$, y en $d$ dimensiones el error sigue siendo proporcional a $1/\sqrt{N}$, sin depender de $d$.
- **Variante con el círculo completo:** puntos uniformes en $[-1, 1]^2$ caen en el disco unitario con probabilidad $\pi/4$; es el mismo estimador.

:::figura[La aguja de Buffon con largo igual a la separación, para comparar: cada lanzamiento aporta menos información sobre π que un punto en el cuadrado.]{componente="BuffonNeedle"}

```yaml
largo: 1
agujas: 2000
```

:::

## Errores comunes

- **Olvidar el factor 4.** La proporción de puntos dentro estima $\pi/4 \approx 0.785$, no $\pi$.
- **Usar puntos que no son uniformes en el cuadrado.** Si los puntos se generan con radio y ángulo uniformes, se concentran cerca del origen y la proporción deja de estimar $\pi/4$.
- **Confiar en coincidencias de dígitos.** Una corrida que da 3.1416 con pocos miles de puntos es suerte, no precisión; otra semilla dará un valor diferente.

:::figura[Puntos generados con radio uniforme en lugar de área uniforme: la proporción dentro de un disco de radio 0.9 converge a 0.9 en lugar de 0.81, y cualquier estimación basada en ella queda sesgada.]{componente="GeometricProbability"}

```yaml
escenario: disco
radio: 0.9
muestreo: radio
```

:::

## Conexiones

Es el ejemplo canónico de [[estimacion-de-probabilidades-por-simulacion-monte-carlo]] aplicado a [[probabilidad-geometrica]], y se contrasta con la [[aguja-de-buffon]], otro método histórico para estimar $\pi$ con azar. La misma técnica, con funciones en lugar de regiones, es la integración de Monte Carlo, cuya justificación es la ley de los grandes números y cuyo margen de error proviene del teorema central del límite.

## Formulario

:::formula[Probabilidad de caer en el cuarto de círculo]

$$
P(X^2 + Y^2 \le 1) = \frac{\pi}{4}
$$

- $(X, Y)$: punto uniforme en el cuadrado $[0, 1]^2$.
  :::

:::formula[Estimador de pi]

$$
\hat{\pi}_N = \frac{4}{N}\sum_{i=1}^{N} \mathbf{1}\{X_i^2 + Y_i^2 \le 1\}
$$

- $N$: número de puntos; $\mathbf{1}\{\cdot\}$: 1 si el punto cae dentro, 0 si no.
  :::

:::formula[Error estándar]

$$
\mathrm{EE}(\hat{\pi}_N) = 4\sqrt{\frac{\frac{\pi}{4}\left(1 - \frac{\pi}{4}\right)}{N}} \approx \frac{1.64}{\sqrt{N}}
$$

- $\frac{\pi}{4}\left(1 - \frac{\pi}{4}\right)$: varianza de la indicadora de caer dentro.
  :::

:::formula[Puntos necesarios para un margen de error]

$$
N \approx \left(\frac{1.96 \cdot 1.64}{e}\right)^2
$$

- $e$: margen de error deseado para $\hat{\pi}$, con 95 % de confianza.
  :::
