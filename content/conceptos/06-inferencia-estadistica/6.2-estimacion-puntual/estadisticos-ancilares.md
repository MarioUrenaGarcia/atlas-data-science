---
id: estadisticos-ancilares
titulo: Estadísticos ancilares
titulo_en: Ancillary statistics
alias:
  - estadístico ancilar
  - estadístico auxiliar
modulo: 6
submodulo: '6.2'
orden: 15
nivel: avanzado
prerrequisitos:
  - suficiencia
etiquetas:
  - inferencia
  - ancilaridad
  - invariancia
  - familias de localización
resumen: >
  Un estadístico es ancilar si su distribución no depende del parámetro. Por sí solo no informa sobre el
  parámetro, pero puede indicar la precisión con que otros estadísticos lo estiman.
formula: 'P_\theta(A(\mathbf{X}) \le a)\ \text{es la misma para todo } \theta'
visualizacion:
  componente: SufficiencyLab
  parametros:
    modo: ancilar
    n: 5
referencias:
  - clave: casella-berger
    capitulo: '6'
publicado: true
---

## Intuición

Una báscula tiene un error de calibración desconocido $\mu$: todo lo que pesa sale desplazado $\mu$ gramos. Si se pesa cinco veces el mismo objeto, el promedio de las cinco lecturas sirve para estimar el peso más el desplazamiento. En cambio, la diferencia entre la lectura más alta y la más baja, el rango, no cambia por el desplazamiento: si todas las lecturas se mueven $\mu$ gramos, su rango sigue igual.

Un estadístico cuya distribución no depende del parámetro se llama **ancilar**. Por sí solo no dice nada sobre $\mu$. En este modelo, con la desviación de la báscula conocida, tampoco cambia la precisión del promedio: el promedio es suficiente y completo, y por el teorema de Basu el rango es independiente de él. Los ancilares sí informan sobre la precisión cuando el estadístico suficiente no es completo. En una uniforme en $(\theta, \theta + 1)$, un rango cercano a 1 deja a $\theta$ casi determinado, porque el mínimo y el máximo quedan pegados a los extremos, mientras que un rango pequeño deja mucha incertidumbre.

## Definición

:::definicion[Estadístico ancilar]
Un estadístico $A(\mathbf{X})$ es **ancilar** para $\theta$ si su distribución no depende de $\theta$:
$$
P_\theta(A(\mathbf{X}) \le a) = P_{\theta'}(A(\mathbf{X}) \le a)\quad \text{para todo } a,\ \theta,\ \theta'.
$$
:::

Familias de localización: si $X_i = \mu + Z_i$ con $Z_i$ de distribución fija, cualquier función de las diferencias $X_i - X_j$ es ancilar para $\mu$, como el rango $R = X_{(n)} - X_{(1)}$ o la varianza muestral. Familias de escala: si $X_i = \sigma Z_i$, los cocientes $X_i/X_j$ son ancilares para $\sigma$.

:::nota[Qué significa cada símbolo]
- $A(\mathbf{X})$: estadístico; $a$: un valor cualquiera.
- $\theta$, $\theta'$: dos valores del parámetro.
- $\mu$: parámetro de localización; $\sigma$: de escala; $Z_i$: variables con distribución fija.
- $X_{(n)}$, $X_{(1)}$: máximo y mínimo; $R$: rango.
:::

## Cómo usar la visualización

Cada muestra normal de tamaño 5, con media $\mu$ y desviación 1, aporta un punto con su media en el eje horizontal y su rango en el vertical. El control **Media de la población** desplaza $\mu$ y el control **Desviación de la población** cambia la escala $\sigma$.

Experimentos sugeridos:

1. Mover $\mu$ de $-5$ a $5$: la nube se desplaza de lado, pero su altura no cambia; el rango medio sigue cerca de 2.33.
2. Cambiar $n$ a 20: el rango sube (hay más datos para alejarse) pero sigue sin depender de $\mu$.
3. Observar que la correlación entre media y rango es cercana a cero.
4. Subir la desviación a 2: el rango medio se duplica; el rango no es ancilar para un parámetro de escala.

## Ejemplo

Cinco lecturas de una báscula: 101.2, 99.8, 100.5, 100.9 y 99.6 gramos.

1. Media: $502.0/5 = 100.4$; depende del desplazamiento $\mu$ y del peso real.
2. Rango: $101.2 - 99.6 = 1.6$.
3. Si la báscula se recalibra y todas las lecturas bajan 0.4 g, la media pasa a 100.0 y el rango sigue en 1.6.
4. Para lecturas normales con desviación 1, el rango esperado de 5 datos es aproximadamente 2.33, sin importar $\mu$; un rango de 1.6 indica una muestra algo más compacta que lo habitual.

:::figura[Muestras de 15 lecturas: el rango es mayor que con 5, pero su distribución sigue sin moverse con mu.]{componente="SufficiencyLab"}
```yaml
modo: ancilar
n: 15
```
:::

## Propiedades

- **No informa sobre θ por sí solo,** pero puede hacerlo combinado con un suficiente no completo.
- **Principio de condicionalidad:** se recomienda hacer inferencia condicional al valor observado de un ancilar.
- **Teorema de Basu:** un ancilar es independiente de cualquier estadístico suficiente completo.

:::figura[Con muestras de dos lecturas, el rango es la diferencia entre ambas y sigue siendo ancilar para la media.]{componente="SufficiencyLab"}
```yaml
modo: ancilar
n: 2
```
:::

## Errores comunes

- **Creer que un ancilar siempre es inútil, o que siempre informa sobre la precisión.** Si el suficiente es completo, como la media normal con desviación conocida, el ancilar es independiente de él y no cambia la precisión. Si no es completo, como en la uniforme en $(\theta, \theta + 1)$, el ancilar indica qué tan precisa es la estimación en la muestra concreta.
- **Pensar que ancilar es lo contrario de suficiente.** Un estadístico puede no ser ni una cosa ni la otra.
- **Suponer que la varianza muestral es ancilar para todo.** Es ancilar para un parámetro de localización, no para uno de escala.

:::figura[Desviación 2.5 en lugar de 1: el rango medio se multiplica por 2.5, así que el rango es ancilar para la media pero no para la escala.]{componente="SufficiencyLab"}
```yaml
modo: ancilar
n: 5
sigma: 2.5
```
:::

## Conexiones

Los ancilares contrastan con los estadísticos con [[suficiencia]]: unos no dicen nada sobre el parámetro, los otros lo dicen todo. El [[teorema-de-basu]] los relaciona con la [[completitud]]. El rango es un ejemplo conocido de [[rango|medida de dispersión]].

## Formulario

:::formula[Ancilaridad]
$$
P_\theta(A(\mathbf{X}) \le a) = P_{\theta'}(A(\mathbf{X}) \le a)
$$

- $A$: estadístico; $\theta$, $\theta'$: valores cualesquiera del parámetro.
:::

:::formula[Rango en una familia de localización]
$$
R = X_{(n)} - X_{(1)} = Z_{(n)} - Z_{(1)}
$$

- $X_i = \mu + Z_i$: el desplazamiento $\mu$ se cancela al restar.
:::
