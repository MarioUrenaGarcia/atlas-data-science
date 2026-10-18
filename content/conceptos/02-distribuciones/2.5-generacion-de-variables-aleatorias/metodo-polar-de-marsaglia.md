---
id: metodo-polar-de-marsaglia
titulo: Método polar de Marsaglia
titulo_en: Marsaglia polar method
alias:
  - método polar
  - Box-Muller polar
modulo: 2
submodulo: '2.5'
orden: 7
nivel: intermedio
prerrequisitos:
  - metodo-de-box-muller
relaciones:
  - tipo: relacionado
    id: metodo-de-aceptacion-y-rechazo
etiquetas:
  - normal
  - rechazo
  - círculo unitario
  - simulación
  - eficiencia
resumen: >
  Variante del método de Box-Muller que sortea un punto uniforme en el círculo unitario por rechazo y obtiene
  dos normales sin calcular senos ni cosenos. Acepta una fracción π/4 de los puntos propuestos.
formula: 's = V_1^{2} + V_2^{2} < 1: \quad Z_i = V_i\sqrt{\frac{-2\log s}{s}}, \qquad P(\text{aceptar}) = \frac{\pi}{4}'
visualizacion:
  componente: RandomLab
  parametros:
    modo: polar
referencias:
  - clave: ross-procesos
publicado: true
---

## Intuición

El método de Box-Muller necesita un seno y un coseno por cada par de normales, y en las computadoras de los años sesenta esas funciones eran caras. Marsaglia observó que el seno y el coseno de un ángulo uniforme se pueden obtener sin calcularlos: basta tomar un punto al azar dentro del círculo unitario. La dirección de ese punto es un ángulo uniforme, y sus coordenadas divididas entre su distancia al origen son exactamente el coseno y el seno de ese ángulo.

Para sortear un punto uniforme en el círculo se usa un truco de rechazo: se sortea un punto en el cuadrado que lo contiene y, si cae fuera del círculo, se descarta y se intenta de nuevo. Como el círculo ocupa $\pi/4 \approx 78.5\,\%$ del cuadrado, la mayoría de los intentos tiene éxito. Además, el cuadrado de la distancia al origen de un punto uniforme en el círculo es a su vez uniforme, así que sirve para construir el radio, en lugar de una uniforme nueva.

El resultado son dos normales independientes, igual que con Box-Muller, con un logaritmo y una raíz pero sin funciones trigonométricas, a cambio de descartar uno de cada cinco puntos aproximadamente.

## Definición

:::definicion[Método polar]
1. Sortear $V_1, V_2$ uniformes independientes en $(-1, 1)$ y calcular $s = V_1^{2} + V_2^{2}$.
2. Si $s \ge 1$ o $s = 0$, rechazar y volver al paso 1.
3. Si no, devolver
$$
Z_1 = V_1\sqrt{\frac{-2\log s}{s}}, \qquad Z_2 = V_2\sqrt{\frac{-2\log s}{s}}.
$$
:::

Aceptado el punto, $s$ es uniforme en $(0, 1)$ e independiente de la dirección $(V_1, V_2)/\sqrt{s}$, que es uniforme en la circunferencia. Por eso $Z_1, Z_2$ son normales estándar independientes, como en Box-Muller con $U_1 = s$.

:::nota[Qué es X]
$(Z_1, Z_2)$ = el par de normales estándar que se obtiene de cada punto aceptado dentro del círculo.
:::

:::nota[Qué hace cada parámetro]
- **$(V_1, V_2)$, punto propuesto:** su dirección fija el ángulo de las normales. Si cae fuera del círculo, se descarta.
- **$s$, distancia al cuadrado:** hace de uniforme para el radio. Si es pequeña, el punto está cerca del centro y las normales salen grandes.
:::

:::nota[Qué significa cada símbolo]
- $V_1$, $V_2$: uniformes en $(-1, 1)$; $s$: suma de sus cuadrados.
- $Z_1$, $Z_2$: normales estándar; $\log$: logaritmo natural.
- $\pi/4$: fracción del cuadrado que ocupa el círculo unitario.
:::

## Cómo usar la visualización

A la izquierda están los puntos propuestos en el cuadrado de lado 2: los de dentro del círculo se aceptan y los de fuera se rechazan, con colores distintos. A la derecha están las normales que producen los puntos aceptados. Cada paso de la reproducción propone un punto y el botón agrega 500. El panel compara la tasa de aceptación con $\pi/4$ y da el valor de $s$ del último punto.

Agrega varios miles de puntos y comprueba que la tasa se acerca a 0.785. Observa que los rechazados están todos en las esquinas del cuadrado. Compara la nube de normales con la del método de Box-Muller: son la misma distribución.

## Ejemplo

Se propone el punto $(v_1, v_2) = (0.3, -0.4)$.

1. $s = 0.09 + 0.16 = 0.25 < 1$: se acepta.
2. Factor: $\sqrt{\frac{-2\log 0.25}{0.25}} = \sqrt{\frac{2.773}{0.25}} = \sqrt{11.09} \approx 3.330$.
3. $z_1 = 0.3 \cdot 3.330 \approx 0.999$ y $z_2 = -0.4 \cdot 3.330 \approx -1.332$.
4. Si en cambio se propone $(0.8, 0.7)$, $s = 1.13 \ge 1$ y se rechaza.
5. En promedio hacen falta $1/(\pi/4) \approx 1.27$ propuestas, es decir, unas 2.55 uniformes, por cada par de normales.

:::figura[Propuestas en el cuadrado y normales obtenidas: los puntos de las esquinas se rechazan y la tasa de aceptación se acerca a π/4 ≈ 0.785.]{componente="RandomLab"}
```yaml
modo: polar
```
:::

## Propiedades

- **Exactitud:** produce normales exactas, igual que Box-Muller.
- **Tasa de aceptación:** $\pi/4 \approx 0.785$; el número de intentos por par es geométrico con media $4/\pi \approx 1.27$.
- **Independencia de radio y ángulo:** aceptado el punto, $s$ es uniforme e independiente de su dirección.
- **Costo:** un logaritmo, una raíz y una división por par, sin senos ni cosenos.
- **Relación con el rechazo:** es un caso del método de aceptación y rechazo con el cuadrado como envolvente del círculo.

:::figura[Otra semilla: con distinta semilla cambian los puntos, pero la tasa de aceptación sigue cerca de π/4 y las normales siguen siendo redondas.]{componente="RandomLab"}
```yaml
modo: polar
semilla: 31
```
:::

## Errores comunes

- **Aceptar los puntos con $s$ igual a cero.** $\log 0$ no existe; ese punto, aunque improbable, se rechaza.
- **Sortear una uniforme nueva para el radio.** El método usa la misma $s$; sortear otra rompe la relación que hace correcto al método.
- **Pensar que el rechazo sesga el resultado.** Los puntos aceptados son uniformes en el círculo y las normales son exactas.
- **Esperar un número fijo de uniformes por normal.** El número de intentos es aleatorio; en promedio 1.27 por par, pero a veces más.

:::figura[Rechazo y cuadrado: el método es aceptación y rechazo con el cuadrado como envolvente; aquí la misma idea con una densidad beta y una uniforme como propuesta.]{componente="RandomLab"}
```yaml
modo: aceptacion-rechazo
objetivo: beta
valores:
  holgura: 1
```
:::

## Conexiones

Es una variante del [[metodo-de-box-muller]] que usa el [[metodo-de-aceptacion-y-rechazo]] para sortear un punto en el círculo. Produce la [[distribucion-normal]] a partir de la [[distribucion-uniforme-continua]], y su número de intentos sigue una [[distribucion-geometrica]]. Para generar normales aún más rápido se usa el [[algoritmo-ziggurat]]. El [[mapa-de-relaciones-entre-distribuciones]] muestra estas construcciones.

## Formulario

:::formula[Método polar]
$$
s = V_1^{2} + V_2^{2} < 1, \qquad Z_i = V_i\sqrt{\frac{-2\log s}{s}}
$$

- $V_1$, $V_2$: uniformes en $(-1, 1)$; $Z_1$, $Z_2$: normales estándar.
:::

:::formula[Tasa de aceptación]
$$
P(s < 1) = \frac{\pi}{4} \approx 0.785, \qquad \mathbb{E}[\text{intentos}] = \frac{4}{\pi} \approx 1.27
$$

- Cociente entre el área del círculo unitario y la del cuadrado de lado 2.
:::
